from django.http import response
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.serializers import Serializer
from rest_framework.views import APIView
from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from api import serializers
from .utils import *
from .decorators import allowed_users



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
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)

class HomePageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    
    # permission_classes_by_action = {
    #     'search': [AllowAny],  # Allow any user to access the 'search' endpoint
    #     'leaderboard': [IsAuthenticated],
    #     'favourite': [IsAuthenticated],
    #     'history': [IsAuthenticated],
    #     'recommend': [IsAuthenticated],
    # }
    
    # def initial(self, request, *args, **kwargs):
    #     # Get the action from the request query parameters
    #     self.action = request.query_params.get('action', 'search')
    #     super().initial(request, *args, **kwargs)

    # def get_permissions(self):
    #     try:
    #         # Return the permission_classes for the current action
    #         return [permission() for permission in self.permission_classes_by_action[self.action]]
    #     except KeyError:
    #         # If the action is not specified in permission_classes_by_action, use the default permissions
    #         return [permission() for permission in self.permission_classes]
    
    @permission_classes([AllowAny])
    def search(self, request):
        query = request.query_params.get('query', '')

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
            return self.search(request)
    # def get(self, request):
    #     user_id = self.request.user.id
    #     if self.action == 'search':
    #         return self.search(request)
    #     elif self.action == 'leaderboard':
    #         return self.getLeaderboard()
    #     elif self.action == 'favourite':
    #         return self.getFavourite(user_id)
    #     elif self.action == 'history':
    #         return self.getHistory(user_id)
    #     elif self.action == 'recommend':
    #         return self.getRecommend(user_id)
    #     else:
    #         return Response({'detail': 'Invalid action.'}, status=400)

    
class AccountsPageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    @allowed_users(allowed_roles=['Admin'])
    def getAccountsList(self, request):
        accounts = User.objects.all().order_by('id')
        serializer = UserSerializer(accounts, many=True)
        return Response(serializer.data)

    @allowed_users(allowed_roles=['Admin'])
    def deleteAccount(self, request, pk):
        account = User.objects.get(id=pk)
        account.delete()
        return Response('Account was deleted!')
    
    def get(self, request):
        return self.getAccountsList(request)
    
class ProfilePageAPI(APIView):
    def getProfileDetail(self, request):
        if request.user.is_authenticated:
            user_id = request.user.id 
            profile = Profile.objects.filter(user_id=user_id).first()
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        else:
            return Response({'detail': 'User is not authenticated.'}, status=401)
    
    def get(self, request):
        return self.getProfileDetail(request)
    
class ArtistsPageAPI(APIView):
    def getArtistsList(self, request):
        query = request.query_params.get('query', '')
        # Filter songs based on the search query
        artists = Artist.objects.filter(Q(name__icontains=query))
        serializer = ArtistSerializer(artists, many = True)
        return Response(serializer.data)

    def getArtistDetail(self, request, pk):
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
    
    def createArtist(self, request):
        serializer = ArtistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def deleteArtist(self, request, pk):
        artist = Artist.objects.get(id=pk)
        artist.delete()
        return Response('Artist was deleted!')

    def get(self, request, pk=None):
        if pk:
            return self.getArtistDetail(request, pk)
        else:
            return self.getArtistsList(request)
    
    def post(self, request):
        return self.createArtist(request)

    def delete(self, request, pk=None):
        return self.deleteArtist(request, pk)
        
class SongsPageAPI(APIView):
    def getSongsList(self, request):
        query = request.query_params.get('query', '')
        # Filter songs based on the search query
        songs = Song.objects.filter(Q(name__icontains=query))
        if not songs.exists():
            # If no exact match found, try to find songs with similar names
            similar_songs = Song.objects.filter(name__icontains=query)
            if similar_songs.exists():
                songs = similar_songs
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    def getSongDetail(self, request, pk):
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

    def createSong(self, request):
        # Lấy thông tin tài khoản người dùng
        account = request.user

        # Lấy dữ liệu từ request
        name = request.data.get('name', '')
        likes = request.data.get('likes', 0)
        listens = request.data.get('listens', 0)
        song_file = request.FILES.get('song_file')
        lyric_file = request.FILES.get('lyric_file')
        avatar = request.FILES.get('avatar')
        background_image = request.FILES.get('background_image')
        created_date = request.data.get('created_date')

        # Tạo instance của SongSerializer với các trường dữ liệu
        serializer = SongSerializer(data={
            'name': name,
            'likes': likes,
            'listens': listens,
            'song_file': song_file,
            'lyric_file': lyric_file,
            'avatar': avatar,
            'background_image': background_image,
            'created_date': created_date,
            'account': account.id,  # Lưu ID của tài khoản
            # Các trường khác của model Song mà bạn muốn lấy từ dữ liệu
        })

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

        # serializer = SongSerializer(data=request.data, context={'request': request})
        # serializer.is_valid(raise_exception=True)
        # serializer.save()
        # return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def deleteSong(self, request, pk):
        song = Song.objects.get(id=pk)
        song.delete()
        return Response('Song was deleted!')
    
    def get(self, request, pk=None):
        if pk:
            return self.getSongDetail(request, pk)
        else:
            return self.getSongsList(request)
    
    def post(self, request):
        return self.createSong(request)
    
    def delete(self, request, pk=None):
        return self.deleteSong(request, pk)
    
class PlaylistsPageAPI(APIView):
    def getPlaylistsList(self, request):
        query = request.query_params.get('query', '')
        # Filter songs based on the search query
        playlists = Playlist.objects.filter(Q(status='pub') & Q(name__icontains=query))
        if not playlists.exists():
            # If no exact match found, try to find songs with similar names
            similar_playlists = Playlist.objects.filter(name__icontains=query)
            if similar_playlists.exists():
                playlists = similar_playlists
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    def getPlaylistDetail(self, request, pk):
        playlist = Playlist.objects.get(id=pk)
        serializer = PlaylistSerializer(playlist, many = False)
        return Response(serializer.data)

    def createPlaylist(self, request):
        data = {
            'name': request.data.get('name', ''),
            'status': request.data.get('status', 'pvt'),
            'account': request.user.pk,
            'avatar': request.FILES.get('avatar'),
            'background_image': request.FILES.get('background_image')
        }
        serializer = PlaylistSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        playlist = serializer.save()

        # Xử lý trường songs nếu có
        songs_data = request.data.get('songs', [])
        playlist.songs.set(songs_data)  # Gán danh sách bài hát cho danh sách phát

        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def deletePlaylist(self, request, pk):
        playlist = Playlist.objects.get(id=pk)
        playlist.delete()
        return Response('Playlist was deleted!')

    def get(self, request, pk=None):
        if pk:
            return self.getPlaylistDetail(request, pk)
        else:
            return self.getPlaylistsList(request)
    
    def post(self, request):
        return self.createPlaylist(request)
    
    def delete(self, request, pk=None):
        return self.deletePlaylist(request, pk)
  
    