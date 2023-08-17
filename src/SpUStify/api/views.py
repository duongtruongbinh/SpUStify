
from django.contrib.auth import login as auth_login
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication, BasicAuthentication
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
def get_routes(request):
    routes = [
        {
            'Endpoint': '/songs/',
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
        filtered_songs = Song.objects.filter(
            Q(name__icontains=query) |
            Q(main_artist__artist_name__icontains=query) |
            Q(collabartist__artist__artist_name__icontains=query)
        ).distinct().order_by('-created_date')

        # Filter playlists that have 'status' attribute set to 'pub' and match the search query
        filtered_playlists = Playlist.objects.filter(
            Q(status='pub') & (
                Q(name__icontains=query) |
                Q(songs__name__icontains=query)
            )
        ).distinct().order_by('-created_date')

        # Serialize the results
        song_serializer = SongSerializer(filtered_songs, many=True)
        playlist_serializer = PlaylistSerializer(filtered_playlists, many=True)
        
        response_data = {
            'List_of_songs': song_serializer.data,
            'List_of_playlists': playlist_serializer.data,
        }

        return Response(response_data)
    
    @permission_classes([IsAuthenticated])
    def get_leaderboard(self):
        songs_by_listens = Song.objects.order_by('-listens')[:2]
        listens_serializer = SongSerializer(songs_by_listens, many=True)
        
        songs_by_likes = Song.objects.order_by('-likes')[:2]
        likes_serializer = SongSerializer(songs_by_likes, many=True)
        
        response_data = {
            'Leaderboard_by_likes': likes_serializer.data,
            'Leaderboard_by_listens': listens_serializer.data,
        }
        return Response(response_data )
    
    @permission_classes([IsAuthenticated])
    def get_favourites(self, user_id):
        user_played_songs = UserPlayedSong.objects.filter(played_song__accounts__id=user_id, liked=True)
        user_played_songs_serializer = UserPlayedSongSerializer(user_played_songs, many=True)
        
        user_played_playlists = UserPlayedPlaylist.objects.filter(played_playlist__accounts__id=user_id, liked=True)
        user_played_playlists_serializer = UserPlayedPlaylistSerializer(user_played_playlists, many=True)
        
        response_data = {
            'Favourite_song': user_played_songs_serializer.data,
            'Favourite_playlist': user_played_playlists_serializer.data,
        }
        return Response(response_data )
    
    @permission_classes([IsAuthenticated])
    def get_history(self, user_id):
        played_songs = PlayedSong.objects.filter(accounts__id=user_id)
        played_songs_serializer = PlayedSongSerializer(played_songs, many=True)
        
        played_playlists = PlayedPlaylist.objects.filter(accounts__id=user_id)
        played_playlists_serializer = PlayedPlaylistSerializer(played_playlists, many=True)
        
        response_data = {
            'History_of_songs': played_songs_serializer.data,
            'History_of_playlists': played_playlists_serializer.data,
        }
        return Response(response_data )
    
    @permission_classes([IsAuthenticated])
    def get_recommendations(self, user_id):
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
            'Recommended_songs': recommended_songs_serializer.data,
            'Recommended_playlists': recommended_playlists_serializer.data,
        }
        return Response(response )
    
    def get(self, request, feature=None):
        user_id = request.user.id
        if feature:
            if feature == "leaderboard":
                return self.get_leaderboard()
            elif feature == "favourite":
                return self.get_favourites(user_id)
            elif feature == "history":
                return self.get_history(user_id)
            elif feature == "recommend":
                return self.get_recommendations(user_id)
        else:
            return self.search()
    
class AccountsPageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminGroup]
    
    def get_accounts_list(self):
        accounts = User.objects.all().order_by('id')
        serializer = UserSerializer(accounts, many=True)
        return Response(serializer.data)

    def delete_account(self, pk):
        account = User.objects.filter(pk=pk).first()
        if not account:
            return Response({'error': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        account.delete()
        return Response('Account was deleted!', status=status.HTTP_204_NO_CONTENT)     
    
    def get(self, request):
        return self.get_accounts_list()
    
    
class ProfilePageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated, IsUserGroup, IsArtistGroup]
    serializer_class = ProfileSerializer
    
    def get_user_profile(self):
        profile = Profile.objects.filter(account=self.request.user).first()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, )
    
    def create_profile(self):
        data = self.request.data.copy()
        account = self.request.user
        serializer = ProfileSerializer(data=data)
        
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save(account=account)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({'error': 'A profile already exists for this user.'})
        
    def edit_profile(self):
        account = self.request.user
        profile = Profile.objects.filter(account=account).first()

        if not profile:
            return Response({'error': 'Profile not found.'})

        data = self.request.data
        serializer = ProfileSerializer(profile, data=data, partial=True)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data )
    
    def get(self, request):
        return self.get_user_profile()
    
    def post(self, request):
        return self.create_profile()
    
    def put(self, request):
        return self.edit_profile()
    
class ArtistsPageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FeaturesArtistSerializer
    
    def get_artists_list(self):
        query = self.request.query_params.get('query', '')
        # Filter songs based on the search query
        artists = Artist.objects.filter(Q(artist_name__icontains=query))
        serializer = ArtistSerializer(artists, many = True)
        return Response(serializer.data)

    def create_artist(self):
        data = self.request.data.copy()
        serializer = FeaturesArtistSerializer(data=data)
    
        serializer.is_valid(raise_exception=True)
        serializer.save()
       
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def get(self, request):
        if not self.request.user.groups.filter(name__in=['Admin', 'User']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.get_artists_list()
    
    def post(self, request):
        if not self.request.user.groups.filter(name__in=['Admin', 'Artist']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.create_artist()
    

class DetailArtistAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    
    def get_artist_details(self, artist_id):
        try:
            artist = Artist.objects.get(id=artist_id)
        except Artist.DoesNotExist:
            return Response({'error': 'Artist not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if not artist.profile:
            return Response({'error': 'Does not have any information about this artist.'})
        
        profile = artist.profile
        
        artist_serializer = ProfileSerializer(profile, many = False)
        related_songs = Song.objects.filter(main_artist=artist)
        
        related_songs_serializer = SongSerializer(related_songs, many=True)
        
        response = {
            'Artist': artist_serializer.data,
            'Related_Songs': related_songs_serializer.data,
        }
    
        return Response(response )
    
    def edit_artist(self, artist_id):
        try:
            artist = Artist.objects.get(id=artist_id)
        except Artist.DoesNotExist:
            return Response({'error': 'Artist not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if not artist.profile:
            return Response({'error': 'Profile of artist is not found.'})
        
        data = self.request.data
        profile = artist.profile
        serializer = ProfileSerializer(profile, data=data, partial=True)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, )
        
    def delete_artist(self, artist_id):
        try:
            artist = Artist.objects.get(id=artist_id)
        except Artist.DoesNotExist:
            return Response({'error': 'Artist not found.'})
        
        artist.delete()
        return Response('Artist was deleted!')
    
    def get(self, request, artist_id):
        return self.get_artist_details(artist_id)
    
    def put(self, request, artist_id):
        return self.edit_artist(artist_id)
    
    def delete(self, request, artist_id):
        return self.delete_artist(artist_id)
    
class SongsPageAPI(APIView):
    serializer_class = FeaturesSongSerializer
    #authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    
    def get_songs_list(self):
        query = self.request.query_params.get('query', '')
        songs = Song.objects.filter(Q(name__icontains=query))
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data, )

    def create_song(self):
        data = self.request.data.copy()
        serializer = FeaturesSongSerializer(data=data)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)
    
    def get(self, request):
        return self.get_songs_list()
    
    def post(self, request):
        if not self.request.user.groups.filter(name__in=['Admin', 'Artist']).exists():
            raise PermissionDenied(detail='You do not have permission to access this resource.')
        return self.create_song()
    
class DetailSongPageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = EditSongSerializer
    
    def get_detail_song(self, song_id):
        song = get_object_or_404(Song, id=song_id)
        serializer = DetailSongSerializer(song, many=False)
        
        related_songs = Song.objects.filter(main_artist__id=song.main_artist.id).exclude(id=song_id)
        related_serializer = SongSerializer(related_songs, many=True)
        
        response = {
            'Song': serializer.data,
            'Related_Songs': related_serializer.data,
        }
        
        return Response(response )
    
    def edit_song(self, song_id):
        song = get_object_or_404(Song, id=song_id)
        serializer = EditSongSerializer(song, data=self.request.data, partial=True)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Song details updated successfully.'}, )
        
    def delete_song(self, song_id):
        song = get_object_or_404(Song, id=song_id)
        song.delete()
        return Response('Song was deleted!')
    
    def get(self, request, song_id=None):
        return self.get_detail_song(song_id)
    
    def put(self, request, song_id=None):
        return self.edit_song(song_id)
    
    def delete(self, request, song_id=None):
        if not self.request.user.groups.filter(name__in=['Admin', 'Artist']).exists():
            return Response({'error': 'You do not have permission to access this resource.'})
        
        return self.delete_song(song_id)

class AddSongToPlaylistAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AddSongToPlaylistSerializer
    
    def add_song_to_playlist(self, song_id):
        serializer = AddSongToPlaylistSerializer(data=self.request.data)
        if not serializer.is_valid():
            return Response(serializer.errors)
        
        playlist_id = serializer.validated_data['playlist_id'].id

        playlist = get_object_or_404(Playlist, id=playlist_id, account=self.request.user)
        song = get_object_or_404(Song, id=song_id)
        playlist.songs.add(song)

        return Response({'message': 'Song added to playlist successfully.'}, )
            

    def post(self, request, song_id=None):
        return self.add_song_to_playlist(song_id)

class PlaySongAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def play_song(self, song_id):
        song = get_object_or_404(Song, id=song_id)

        played_song, _ = PlayedSong.objects.get_or_create(song=song)

        user_played_song, created = UserPlayedSong.objects.get_or_create(
            account=self.request.user,
            played_song=played_song,
            defaults={'liked': False, 'listens': 1}
        )

        if not created:
            user_played_song.listens += 1
            user_played_song.save()

        song_url = song.song_file.url if song.song_file else None
        if not song_url:
            return Response({'song_url': "File is not exist." , 'message': 'Song played successfully'},  )
        return Response({'song_url': song_url , 'message': 'Song played successfully'},  )

    def post(self, request, song_id=None):
        return self.play_song(song_id)
    
class LikeSongAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def like_song(self, song_id):
        song = get_object_or_404(Song, id=song_id)

        played_song, _ = PlayedSong.objects.get_or_create(song=song)

        user_played_song, created = UserPlayedSong.objects.get_or_create(
            account=self.request.user,
            played_song=played_song,
            defaults={'liked': True, 'listens': 0}
        )

        if not created:
            user_played_song.liked = True
            user_played_song.save()

        return Response({'message': 'Song liked successfully'})

    def post(self, request, song_id):
        return self.like_song(song_id)

class PlaylistsPageAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FeaturesPlaylistSerializer
    
    def get_playlists_list(self):
        query = self.request.query_params.get('query', '')
        playlists = Playlist.objects.filter(Q(status='pub') & Q(name__icontains=query))
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data )

    def create_playlist(self):
        data = self.request.data.copy()
        account = self.request.user

        serializer = FeaturesPlaylistSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(account=account)

        return Response(serializer.data)
    
    def get(self, request):
        return self.get_playlists_list()
    
    def post(self, request):
        return self.create_playlist()
    

class DetailPlaylistAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FeaturesPlaylistSerializer
    
    def get_playlist_detail(self, playlist_id):
        playlist = get_object_or_404(Playlist, id=playlist_id)
        serializer = PlaylistSerializer(playlist, many=False)
        return Response(serializer.data)
    
    def edit_playlist(self, playlist_id):
        account = self.request.user
        playlist = get_object_or_404(Playlist, id=playlist_id, account=account)

        if not playlist:
            return Response({'error': 'Playlist not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = self.request.data
        serializer = FeaturesPlaylistSerializer(playlist, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data )

    def delete_playlist(self, playlist_id):
        playlist = get_object_or_404(Playlist, id=playlist_id)
        playlist.delete()
        return Response('Playlist was deleted!')
    
    def get(self, request, playlist_id=None):
        return self.get_playlist_detail(playlist_id)
    
    def put(self, request, playlist_id=None):
        return self.edit_playlist(playlist_id)
    
    def delete(self, request, playlist_id=None):
        return self.delete_playlist(playlist_id)

class PlayPlaylistAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def play_playlist(self, playlist_id):
        playlist = get_object_or_404(Playlist, id=playlist_id)

        played_playlist, _ = PlayedPlaylist.objects.get_or_create(playlist=playlist)

        user_played_playlist, created = UserPlayedPlaylist.objects.get_or_create(
            account=self.request.user,
            played_playlist=played_playlist,
            defaults={'liked': False, 'listens': 1}
        )

        if not created:
            user_played_playlist.listens += 1
            user_played_playlist.save()

        song_data = []
        for song in playlist.songs.all():
            song_url = song.song_file.url if song.song_file else None
            song_data.append({
                'song_name': song.name,
                'song_url': song_url
            })

        return Response({'message': 'Playlist played successfully', 'songs': song_data})

    def post(self, request, playlist_id=None):
        return self.play_playlist(playlist_id)
    
class LikePlaylistAPI(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def like_song(self, playlist_id):
        playlist = get_object_or_404(Playlist, id=playlist_id)

        played_playlist, _ = PlayedPlaylist.objects.get_or_create(playlist=playlist)

        user_played_playlist, created = UserPlayedPlaylist.objects.get_or_create(
            account=self.request.user,
            played_playlist=played_playlist,
            defaults={'liked': True, 'listens': 0}
        )

        if not created:
            user_played_playlist.liked = True
            user_played_playlist.save()

        return Response({'message': 'Playlist liked successfully'})

    def post(self, request, playlist_id=None):
        return self.like_song(playlist_id)
