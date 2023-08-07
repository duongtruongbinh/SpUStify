
from django.contrib.auth import login as auth_login
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.exceptions import PermissionDenied
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from .utils import *
from .permissions import IsAdminGroup, IsArtistGroup, IsUserGroup
from django.db import IntegrityError


@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/home/songs/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an list of songs'
        },
        {
            'Endpoint': '/home/songs/pk',
            'method': 'GET',
            'body': None,
            'description': 'Returns a detailed information of song'
        },
        {
            'Endpoint': '/home/favourite/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an list of favourite songs and playlists'
        },
        {
            'Endpoint': '/home/history/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a list of played songs and playlists'
        },
        {
            'Endpoint': '/home',
            'method': 'GET',
            'body': None,
            'description': 'Returns a homepage'
        },
        {
            'Endpoint': '/home/leaderboard',
            'method': 'GET',
            'body': None,
            'description': 'Returns a leaderboard'
        },
        {
            'Endpoint': '/home/songs/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new note with data sent in post request'
        },
        {
            'Endpoint': '/accounts',
            'method': 'GET',
            'body': None,
            'description': 'Return list of accounts'
        },
        {
            'Endpoint': '/home/recommend',
            'method': 'GET',
            'body': None,
            'description': 'recommend song and playlist'
        },
    ]
    return Response(routes)
    
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response = {
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        }
        return Response(response)

class LoginAPI(KnoxLoginView):
    serializer_class = AuthTokenSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        auth_login(request, user)
        return super(LoginAPI, self).post(request)

class HomePageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    @permission_classes([AllowAny])
    def search(self):
        query = self.request.query_params.get('query', '')

        # Filter songs and artists based on the search query
        songs = Song.objects.filter(
            Q(name__icontains=query) |
            Q(mainartist__artist__name__icontains=query) |
            Q(collabartist__artist__name__icontains=query)
        ).distinct().order_by('-created_date')

        # Filter playlists that have 'status' attribute set to 'pub' and match the search query
        playlists = Playlist.objects.filter(
            Q(status='pub') & (
                Q(name__icontains=query) |
                Q(songs__name__icontains=query)
            )
        ).distinct().order_by('-created_date')

        # Serialize the results
        song_serializer = SongSerializer(songs, many=True)
        playlist_serializer = PlaylistSerializer(playlists, many=True)
        
        response = {
            'songs': song_serializer.data,
            'playlists': playlist_serializer.data,
        }

        return Response(response)
    
    @permission_classes([IsAuthenticated])
    def getLeaderboard(self):
        songsByListens = Song.objects.order_by('-listens')[:2]
        listens_serializer = SongSerializer(songsByListens, many=True)
        
        songsByLikes = Song.objects.order_by('-likes')[:2]
        likes_serializer = SongSerializer(songsByLikes, many=True)
        
        response = {
            'Leaderboard by likes': likes_serializer.data,
            'Leaderboard by listens': listens_serializer.data,
        }
        return Response(response)
    
    @permission_classes([IsAuthenticated])
    def getFavourite(self, user_id):
        userPlayedSongs = UserPlayedSong.objects.filter(played_song__accounts__id=user_id, liked = True )
        userPlayedSongs_serializer = UserPlayedSongSerializer(userPlayedSongs, many=True)
        
        userPlayedPlaylists = UserPlayedPlaylist.objects.filter(played_playlist__accounts__id=user_id, liked = True )
        userPlayedPlaylists_serializer = UserPlayedPlaylistSerializer(userPlayedPlaylists, many=True)
        
        response = {
            'playedSongs': userPlayedSongs_serializer.data,
            'playedPlaylists': userPlayedPlaylists_serializer.data,
        }
        return Response(response)
    
    @permission_classes([IsAuthenticated])
    def getHistory(self, user_id):
        playedSongs = PlayedSong.objects.filter(accounts__id=user_id)
        playedPlaylists = PlayedPlaylist.objects.filter(accounts__id=user_id)
        playedSong_serializer = PlayedSongSerializer(playedSongs, many=True)
        playedPlaylists_serializer = PlayedPlaylistSerializer(playedPlaylists, many=True)
        
        response = {
            'playedSongs': playedSong_serializer.data,
            'playedPlaylists': playedPlaylists_serializer.data,
        }
        return Response(response)
    
    @permission_classes([IsAuthenticated])
    def getRecommend(self, user_id):
        # Retrieve the user's played songs and playlists
        played_song_ids = PlayedSong.objects.filter(accounts__id=user_id).values_list('song__id', flat=True).distinct()
        played_playlist_ids = PlayedPlaylist.objects.filter(accounts__id=user_id).values_list('playlist__id', flat=True).distinct()
        
        # Retrieve the user's favorite songs and playlists
        favorite_song_ids = UserPlayedSong.objects.filter(played_song__accounts__id=user_id, liked=True).values_list('played_song__song__id', flat=True).distinct()
        favorite_playlist_ids = UserPlayedPlaylist.objects.filter(played_playlist__accounts__id=user_id, liked=True).values_list('played_playlist__playlist__id', flat=True).distinct()
        
        # Get recommended song IDs by excluding played song IDs from favorite song IDs
        recommended_song_ids = favorite_song_ids.exclude(id__in=played_song_ids)
        
        # Retrieve recommended songs based on the recommended song IDs
        recommended_songs = Song.objects.filter(id__in=recommended_song_ids)
        top_songs = Song.objects.order_by('-listens')[:2]
        all_recommended_songs = list(recommended_songs) + list(top_songs)
        recommended_songs_serializer = SongSerializer(all_recommended_songs, many=True)
        
        # Get recommended playlist IDs by excluding played playlist IDs from favorite playlist IDs
        recommended_playlist_ids = favorite_playlist_ids.exclude(id__in=played_playlist_ids)
        
        # Retrieve recommended playlists based on the recommended playlist IDs
        recommended_playlists = Playlist.objects.filter(id__in=recommended_playlist_ids)
        recommended_playlists_serializer = PlaylistSerializer(recommended_playlists, many=True)
        
        response = {
            'recommended_songs': recommended_songs_serializer.data,
            'recommended_playlists': recommended_playlists_serializer.data,
        }
        return Response(response)
    
    def get(self, request, feature = None):
        user_id = self.request.user.id
        if feature:
            if feature == "leaderboard":
                return self.getLeaderboard()
            elif feature == "favourite":
                return self.getFavourite(user_id)
            elif feature == "history":
                return self.getHistory(user_id)
            elif feature == "recommend":
                return self.getRecommend(user_id)
        else:
            return self.search()
    
class AccountsPageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminGroup]
    
    def getAccountsList(self):
        accounts = User.objects.all().order_by('id')
        serializer = UserSerializer(accounts, many=True)
        return Response(serializer.data)

    def deleteAccount(self, pk):
        account = User.objects.get(id=pk)
        account.delete()
        return Response('Account was deleted!')
    
    def get(self, request):
        # if not self.request.user.groups.filter(name='Admin').exists():
        #     raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.getAccountsList()
    
    
class ProfilePageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated, IsUserGroup]
    serializer_class = ProfileSerializer
    
    def getProfileDetail(self):
        account = self.request.user
        profile = Profile.objects.filter(account=account).first()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
    def createProfile(self):
        data = self.request.data.copy()
        account = self.request.user
        serializer = ProfileSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save(account=account)
        except IntegrityError:
            # Handling duplicate key error
            return Response({'error': 'A profile already exists for this user.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def editProfile(self):
        account = self.request.user
        profile = Profile.objects.filter(account=account).first()

        if not profile:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = self.request.data

        serializer = ProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        return self.getProfileDetail()
    
    def post(self, request):
        return self.createProfile()
    
    def put(self, request):
        return self.editProfile()
    
class ArtistsPageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ArtistSerializer
    
    def getArtistsList(self):
        query = self.request.query_params.get('query', '')
        # Filter songs based on the search query
        artists = Artist.objects.filter(Q(name__icontains=query))
        serializer = ArtistSerializer(artists, many = True)
        return Response(serializer.data)

    def getArtistDetail(self, pk):
        artist = Artist.objects.get(id=pk)
        artist_serializer = ArtistSerializer(artist, many = False)
        related_songs = MainArtist.objects.filter(artist=pk)
        songs = [related_song.song for related_song in related_songs]
        
        related_songs_serializer = SongSerializer(songs, many=True)
        
        response = {
            'Artist': artist_serializer.data,
            'Related Songs': related_songs_serializer.data,
        }
    
        return Response(response)
    
    def createArtist(self):
        data = self.request.data.copy()
        account = self.request.user
        serializer = ArtistSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save(account=account)
        except IntegrityError:
            # Handling duplicate key error
            return Response({'error': 'A profile already exists for this user.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def editArtist(self):
        # Lấy thông tin tài khoản người dùng
        account = self.request.user
        profile = Artist.objects.filter(account=account).first()

        if not profile:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = self.request.data
        serializer = ArtistSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def deleteArtist(self, pk):
        artist = Artist.objects.get(id=pk)
        artist.delete()
        return Response('Artist was deleted!')

    def get(self, request, pk=None):
        if not self.request.user.groups.filter(name__in=['Admin', 'User']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.getArtistDetail(pk) if pk else self.getArtistsList()
    
    def post(self, request):
        if not self.request.user.groups.filter(name__in=['Admin', 'Artist']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.createArtist()
    
    def put(self, request):
        if not self.request.user.groups.filter(name__in=['Admin', 'Artist']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.editArtist()
    
    def delete(self, request, pk=None):
        # if not self.request.user.groups.filter(name='Admin').exists() and not self.request.user.groups.filter(name='Artist').exists():
        if not self.request.user.groups.filter(name__in=['Admin', 'Artist']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.deleteArtist(pk)
        
class SongsPageAPI(APIView):
    serializer_class = FeaturesSongSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def getSongsList(self):
        query = self.request.query_params.get('query', '')
        # Filter songs based on the search query
        songs = Song.objects.filter(Q(name__icontains=query))
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    def getSongDetail(self, pk):
        song = get_object_or_404(Song, id=pk)
        serializer = SongSerializer(song, many=False)
        
        main_artist = get_object_or_404(MainArtist, song_id=pk)
        related_songs = MainArtist.objects.filter(artist=main_artist.artist).exclude(song=song)
        songs = [related_song.song for related_song in related_songs]
        
        related_serializer = SongSerializer(songs, many=True)
        
        response = {
            'Song': serializer.data,
            'Related Songs': related_serializer.data,
        }
        
        return Response(response)

    def createSong(self):
        data = self.request.data.copy()
        account = self.request.user

        serializer = FeaturesSongSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def deleteSong(self, pk):
        song = Song.objects.get(id=pk)
        song.delete()
        return Response('Song was deleted!')
    
    def get(self, request, pk=None):
        if pk:
            return self.getSongDetail(pk)
        else:
            return self.getSongsList()
    
    def post(self, request):
        if not self.request.user.groups.filter(name__in=['Admin', 'Artist']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.createSong()
    
    def delete(self, request, pk=None):
        if not self.request.user.groups.filter(name__in=['Admin', 'Artist']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.deleteSong(pk)
        
class PlaylistsPageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def getPlaylistsList(self):
        query = self.request.query_params.get('query', '')
        # Filter songs based on the search query
        playlists = Playlist.objects.filter(Q(status='pub') & Q(name__icontains=query))
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    def getPlaylistDetail(self, request, pk):
        playlist = Playlist.objects.get(id=pk)
        serializer = PlaylistSerializer(playlist, many = False)
        return Response(serializer.data)

    def createPlaylist(self):
        data = {
            'name': self.request.data.get('name', ''),
            'status': self.request.data.get('status', 'pvt'),
            'account': self.request.user.pk,
            'avatar': self.request.FILES.get('avatar'),
            'background_image': self.request.FILES.get('background_image')
        }
        serializer = PlaylistSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        playlist = serializer.save()

        # Xử lý trường songs nếu có
        songs_data = self.request.data.get('songs', [])
        playlist.songs.set(songs_data)  # Gán danh sách bài hát cho danh sách phát

        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def deletePlaylist(self, pk):
        playlist = Playlist.objects.get(id=pk)
        playlist.delete()
        return Response('Playlist was deleted!')

    def get(self, request, pk=None):
        if pk:
            return self.getPlaylistDetail(pk)
        else:
            return self.getPlaylistsList()
    
    def post(self, request):
        return self.createPlaylist()
    
    def delete(self, request, pk=None):
        return self.deletePlaylist(pk)
  
    