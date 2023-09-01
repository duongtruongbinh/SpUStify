
from django.contrib.auth import login as auth_login
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication, BasicAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.parsers import MultiPartParser
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from .utils import *
from .permissions import IsAdminGroup, IsArtistGroup, IsUserGroup, IsPlaylistOwner
from django.db import IntegrityError
import os
import shutil


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = [BasicAuthentication]

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
    # authentication_classes = [BasicAuthentication]
    serializer_class = AuthTokenSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Kiểm tra xem tài khoản thuộc nhóm "artist" hay không
        is_artist = user.groups.filter(name='Artists').exists()

        auth_login(request, user)

        # Thêm trường 'is_artist' vào dữ liệu phản hồi
        response_data = {
            'user_id': user.id,
            'username': user.username,
            'is_artist': is_artist,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class AccountViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated,]  # IsAdminGroup]

    def get_accounts_list(self, request):
        accounts = User.objects.all().order_by('id')
        serializer = UserSerializer(accounts, many=True)
        return Response(serializer.data)

    def get_account_detail(self, request, account_id):
        account = get_object_or_404(User, pk=account_id)
        serializer = UserSerializer(account, many=False)
        return Response(serializer.data)

    def get(self, request, account_id=None):
        if account_id:
            return self.get_account_detail(request, account_id)
        return self.get_accounts_list(request)


class EditAccountAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated,]  # IsAdminGroup]

    def delete_account(self, request, account_id):
        account = get_object_or_404(User, pk=account_id)
        account.delete()
        return Response('Account was deleted!')

    def delete(self, request, account_id):
        return self.delete_account(request, account_id)


class HomeViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def search(self, request):
        query = request.query_params.get('query', '')

        # Filter songs and artists based on the search query
        filtered_songs = Song.objects.filter(
            Q(name__icontains=query) |
            Q(main_artist__artist_name__icontains=query)
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

        response = {
            'songs': song_serializer.data,
            'playlists': playlist_serializer.data,
        }

        return Response(response)

    def get(self, request):
        return self.search(request)


class HomeFeaturesAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def get_leaderboard(self, request):
        songs_by_listens = Song.objects.order_by('-listens')[:10]
        listens_serializer = SongSerializer(songs_by_listens, many=True)

        songs_by_likes = Song.objects.order_by('-likes')[:10]
        likes_serializer = SongSerializer(songs_by_likes, many=True)

        response = {
            'likes_leaderboard': likes_serializer.data,
            'listens_leaderboard': listens_serializer.data,
        }
        return Response(response)

    def get_favourites(self, request, user_id):
        user_played_songs = UserPlayedSong.objects.filter(
            played_song__accounts__id=user_id, liked=True)
        user_played_songs_serializer = UserPlayedSongSerializer(
            user_played_songs, many=True)

        user_played_playlists = UserPlayedPlaylist.objects.filter(
            played_playlist__accounts__id=user_id, liked=True)
        user_played_playlists_serializer = UserPlayedPlaylistSerializer(
            user_played_playlists, many=True)

        response = {
            'favourite_songs': user_played_songs_serializer.data,
            'favourite_playlists': user_played_playlists_serializer.data,
        }
        return Response(response)

    def get_history(self, request, user_id):
        played_songs = PlayedSong.objects.filter(accounts__id=user_id)
        played_songs_serializer = PlayedSongSerializer(played_songs, many=True)

        played_playlists = PlayedPlaylist.objects.filter(accounts__id=user_id)
        played_playlists_serializer = PlayedPlaylistSerializer(
            played_playlists, many=True)

        response = {
            'history_songs': played_songs_serializer.data,
            'history_playlists': played_playlists_serializer.data,
        }
        return Response(response)

    def get_recommendations(self, request, user_id):
        # Retrieve the user's favorite songs and playlists
        recommended_song_ids = UserPlayedSong.objects.filter(
            played_song__accounts__id=user_id, liked=True).values_list('played_song__song__id', flat=True).distinct()
        recommended_playlist_ids = UserPlayedPlaylist.objects.filter(
            played_playlist__accounts__id=user_id, liked=True).values_list('played_playlist__playlist__id', flat=True).distinct()

        # Retrieve recommended songs based on the recommended song IDs
        recommended_songs = Song.objects.filter(id__in=recommended_song_ids)
        top_songs = Song.objects.order_by('-listens')[:5]
        all_recommended_songs = set(list(recommended_songs) + list(top_songs))
        recommended_songs_serializer = SongSerializer(
            all_recommended_songs, many=True)

        # Retrieve recommended playlists based on the recommended playlist IDs
        recommended_playlists = Playlist.objects.filter(
            id__in=recommended_playlist_ids)
        recommended_playlists_serializer = PlaylistSerializer(
            recommended_playlists, many=True)

        response = {
            'recommended_songs': recommended_songs_serializer.data,
            'recommended_playlists': recommended_playlists_serializer.data,
        }
        return Response(response)

    def get(self, request, feature=None):
        user_id = request.user.id

        if feature == "leaderboard":
            return self.get_leaderboard(request)
        elif feature == "favourite":
            return self.get_favourites(request, user_id)
        elif feature == "history":
            return self.get_history(request, user_id)
        elif feature == "recommend":
            return self.get_recommendations(request, user_id)


class ProfileViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_user_profile(self, request):
        profile = Profile.objects.filter(account=request.user).first()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def get(self, request):
        return self.get_user_profile(request)


class CreateProfileAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def create_profile(self, request):
        data = request.data.copy()
        account = request.user

        serializer = ProfileSerializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save(account=account)
            return Response(serializer.data)
        except IntegrityError:
            return Response({'error': 'A profile already exists for this user.'})

    def post(self, request):
        return self.create_profile(request)


class EditProfileAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def edit_profile(self, request):
        account = request.user
        profile = Profile.objects.filter(account=account).first()

        if not profile:
            return Response({'error': 'Profile not found.'})

        data = request.data.copy()
        serializer = ProfileSerializer(profile, data=data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def put(self, request):
        return self.edit_profile(request)


class ArtistViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, ]  # IsAdminGroup, IsUserGroup]

    def get_artists_list(self, request):
        query = request.query_params.get('query', '')
        # Filter songs based on the search query
        artists = Artist.objects.filter(Q(artist_name__icontains=query))
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)

    def get_artist_details(self, request, artist_id):
        artist = get_object_or_404(Artist, id=artist_id)

        if not artist.profile:
            return Response({'error': 'Does not have any information about this artist.'})

        profile = artist.profile
        artist_serializer = ProfileSerializer(profile, many=False)

        related_songs = Song.objects.filter(main_artist=artist)
        related_songs_serializer = SongSerializer(related_songs, many=True)

        related_playlists = Playlist.objects.filter(account=profile.account)
        related_playlists_serializer = PlaylistSerializer(
            related_playlists, many=True)

        response = {
            'artist': artist_serializer.data,
            'related_songs': related_songs_serializer.data,
            'related_playlists': related_playlists_serializer.data
        }

        return Response(response)

    def get(self, request, artist_id=None):
        if artist_id:
            return self.get_artist_details(request, artist_id)
        return self.get_artists_list(request)


class CreateArtistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, ]  # IsAdminGroup, IsArtistGroup]
    serializer_class = FeaturesArtistSerializer

    def create_artist(self, request):
        data = request.data.copy()
        account = request.user
        profile = Profile.objects.get(account=account)

        serializer = FeaturesArtistSerializer(data=data)

        serializer.is_valid(raise_exception=True)
        serializer.save(profile=profile)

        return Response(serializer.data)

    def post(self, request):
        return self.create_artist(request)


class EditArtistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, ]  # IsAdminGroup, IsArtistGroup]
    serializer_class = ProfileSerializer

    def edit_artist(self, request, artist_id):
        artist = get_object_or_404(Artist, id=artist_id)

        if not artist.profile:
            return Response({'error': 'Does not have any information about this artist.'})

        data = request.data.copy()
        profile = artist.profile
        serializer = ProfileSerializer(profile, data=data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete_artist(self, request, artist_id):
        artist = get_object_or_404(Artist, id=artist_id)
        artist.delete()
        return Response('Artist was deleted!')

    def put(self, request, artist_id):
        return self.edit_artist(request, artist_id)

    def delete(self, request, artist_id):
        return self.delete_artist(request, artist_id)


class SongsViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def get_songs_list(self, request):
        query = request.query_params.get('query', '')
        songs = Song.objects.filter(Q(name__icontains=query))
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    def get_detail_song(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        serializer = DetailSongSerializer(song, many=False)

        related_songs = Song.objects.filter(
            main_artist__id=song.main_artist.id).exclude(id=song_id)
        related_serializer = SongSerializer(related_songs, many=True)

        response = {
            'song': serializer.data,
            'related_songs': related_serializer.data,
        }

        return Response(response)

    def get(self, request, song_id=None):
        if song_id:
            return self.get_detail_song(request, song_id)
        return self.get_songs_list(request)


class CreateSongAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, ]  # IsAdminGroup, IsArtistGroup]
    serializer_class = FeaturesSongSerializer
    parser_classes = [MultiPartParser]

    def create_song(self, request):
        data = request.data.copy()
        account = request.user
        profile = Profile.objects.get(account=account)
        main_artist = Artist.objects.get(profile=profile)

        serializer = FeaturesSongSerializer(data=data)

        serializer.is_valid(raise_exception=True)
        serializer.save(main_artist=main_artist)

        return Response(serializer.data)

    def post(self, request):
        return self.create_song(request)


class EditSongAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated,]  # IsAdminGroup, IsArtistGroup]
    serializer_class = FeaturesSongSerializer
    parser_classes = [MultiPartParser]

    def edit_song(self, request, song_id):
        profile = Profile.objects.get(account=request.user)
        main_artist = Artist.objects.get(profile=profile)

        song = get_object_or_404(Song, id=song_id, main_artist=main_artist)

        data = request.data.copy()
        serializer = FeaturesSongSerializer(song, data=data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete_song(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        file_paths = {'song': f'SpUStify/api/media/{str(song.song_file)}',
                      'lyric': f'SpUStify/api/media/{str(song.lyric_file)}',
                      'avatar': f'SpUStify/api/media/{str(song.avatar)}',
                      'background_img': f'SpUStify/api/media/{str(song.background_image)}'}

        for attr in file_paths.keys():
            if os.path.exists(file_paths[attr]):
                os.remove(file_paths[attr])
        song.delete()
        return Response('Song was deleted!')

    def put(self, request, song_id=None):
        return self.edit_song(request, song_id)

    def delete(self, request, song_id=None):
        return self.delete_song(request, song_id)


class AddSongToPlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AddSongToPlaylistSerializer

    def add_song_to_playlist(self, request, song_id):
        serializer = AddSongToPlaylistSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        playlist_id = serializer.validated_data['playlist_id'].id

        playlist = get_object_or_404(
            Playlist, id=playlist_id, account=request.user)
        song = get_object_or_404(Song, id=song_id)
        playlist.songs.add(song)

        return Response({'message': 'Song added to playlist successfully.'})

    def post(self, request, song_id=None):
        return self.add_song_to_playlist(request, song_id)


class PlaySongAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def play_song(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        account = request.user if request.user.is_authenticated else None
        if account:
            played_song, _ = PlayedSong.objects.get_or_create(song=song)

            user_played_song, created = UserPlayedSong.objects.get_or_create(
                account=request.user,
                played_song=played_song,
                defaults={'liked': False, 'listens': 1}
            )

            if not created:
                user_played_song.listens += 1
                user_played_song.save()

        song_url = song.song_file.url if song.song_file else None
        if not song_url:
            return Response({'song_url': "File is not exist.", 'message': 'Song played successfully'})
        return Response({'song_url': song_url, 'message': 'Song played successfully'})

    def post(self, request, song_id=None):
        return self.play_song(request, song_id)


class LikeSongAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated,]  # IsAdminGroup, IsUserGroup]

    def like_song(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)

        played_song, _ = PlayedSong.objects.get_or_create(song=song)

        user_played_song, created = UserPlayedSong.objects.get_or_create(
            account=request.user,
            played_song=played_song,
            defaults={'liked': True, 'listens': 0}
        )

        if not created:
            user_played_song.liked = True if user_played_song.liked == False else False
            user_played_song.save()

        return Response({'message': 'Song liked successfully'})

    def post(self, request, song_id):
        return self.like_song(request, song_id)


class DownloadSongAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, ]  # IsAdminGroup, IsUserGroup]

    def copy_file(self, source_file, destination_folder):
        try:
            if not os.path.exists(destination_folder):
                os.makedirs(destination_folder)

            file_name = os.path.basename(source_file)
            destination_path = os.path.join(destination_folder, file_name)

            shutil.copy2(source_file, destination_path)
            print("File copied successfully!")
        except Exception as e:
            print("An error occurred:", e)

    def download_song(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        song_url = song.song_file.url if song.song_file else None
        if not song_url:
            return Response({'song_url': "File is not exist.", 'message': 'Song played successfully'})

        source_file = str(song_url)[1:]
        destination_folder = "download_songs"
        self.copy_file(source_file, destination_folder)
        return Response({'song_url': source_file, 'message': 'Song played successfully'})

    def post(self, request, song_id):
        return self.download_song(request, song_id)


class PlaylistsViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def get_playlists_list(self, request):
        query = request.query_params.get('query', '')
        playlists = Playlist.objects.filter(
            Q(status='pub') & Q(name__icontains=query))
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    def get_playlist_detail(self, request, playlist_id):
        playlist = get_object_or_404(Playlist, id=playlist_id)
        serializer = DetailPlaylistSerializer(playlist, many=False)
        return Response(serializer.data)

    def get(self, request, playlist_id=None):
        if playlist_id:
            return self.get_playlist_detail(request, playlist_id)
        return self.get_playlists_list(request)


class YourPlaylistsViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_playlists_list(self, request):
        query = request.query_params.get('query', '')
        playlists = Playlist.objects.filter(
            Q(account=request.user) & Q(name__icontains=query))
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    def get_playlist_detail(self, request, playlist_id):
        playlist = get_object_or_404(
            Playlist, id=playlist_id, account=request.user)
        serializer = DetailPlaylistSerializer(playlist, many=False)
        return Response(serializer.data)

    def get(self, request, playlist_id=None):
        if playlist_id:
            return self.get_playlist_detail(request, playlist_id)
        return self.get_playlists_list(request)


class CreatePlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CreatePlaylistSerializer
    parser_classes = [MultiPartParser]

    def create_playlist(self, request):
        data = request.data.copy()
        account = request.user

        serializer = CreatePlaylistSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(account=account)

        return Response(serializer.data)

    def post(self, request):
        return self.create_playlist(request)


class EditPlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, ]  # IsPlaylistOwner]
    serializer_class = EditPlaylistSerializer

    def edit_playlist(self, request, playlist_id):

        playlist = get_object_or_404(
            Playlist, id=playlist_id, account=request.user)

        data = request.data.copy()
        serializer = EditPlaylistSerializer(playlist, data=data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete_playlist(self, request, playlist_id):
        playlist = get_object_or_404(Playlist, id=playlist_id)
        file_paths = {'avatar': f'SpUStify/api/media/{str(playlist.avatar)}',
                      'background_img': f'SpUStify/api/media/{str(playlist.background_image)}'}

        for attr in file_paths.keys():
            if os.path.exists(file_paths[attr]):
                os.remove(file_paths[attr])
        playlist.delete()
        return Response('Playlist was deleted!')

    def put(self, request, playlist_id=None):
        return self.edit_playlist(request, playlist_id)

    def delete(self, request, playlist_id=None):
        return self.delete_playlist(request, playlist_id)


class PlayPlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def play_playlist(self, request, playlist_id):
        playlist = get_object_or_404(Playlist, id=playlist_id)
        account = request.user if request.user.is_authenticated else None
        if account:
            played_playlist, _ = PlayedPlaylist.objects.get_or_create(
                playlist=playlist)

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
        return self.play_playlist(request, playlist_id)


class LikePlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def like_song(self, request, playlist_id):
        playlist = get_object_or_404(Playlist, id=playlist_id)

        played_playlist, _ = PlayedPlaylist.objects.get_or_create(
            playlist=playlist)

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
        return self.like_song(request, playlist_id)
