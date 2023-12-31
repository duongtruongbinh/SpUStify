
from django.contrib.auth import login as auth_login
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import IntegrityError

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authentication import BasicAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.parsers import MultiPartParser

from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView

from .models import *
from .serializers import *
from .permissions import *
import os
from SpUStify.settings import MEDIA_ROOT


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
            "token": AuthToken.objects.create(user)[1],
            "is_artist": user.groups.filter(name='Artists').exists()
        }
        return Response(response)


class LoginAPI(KnoxLoginView):
    # authentication_classes = [BasicAuthentication]
    serializer_class = AuthTokenSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Kiểm tra xem tài khoản thuộc nhóm "artist" hay không

        auth_login(request, user)
        is_artist = user.groups.filter(name='Artists').exists()

        try:
            auth_token = AuthToken.objects.get(user=user)
            token = auth_token.digest
        except AuthToken.DoesNotExist:
            # Handle the case where the AuthToken for the user does not exist
            token = None

        # Thêm trường 'is_artist' vào dữ liệu phản hồi
        response_data = {
            'user_id': user.id,
            'username': user.username,
            'is_artist': is_artist,
            "token": token,
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


class DeleteAccountAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated,]  # IsAdminGroup]

    def delete(self, request, account_id, *args, **kwargs):
        account = get_object_or_404(User, pk=account_id)
        account.delete()
        return Response('Account was deleted!')


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

        filtered_artists = Artist.objects.filter(
            Q(artist_name__icontains=query)
        ).distinct()

        # Serialize the results
        song_serializer = SongSerializer(filtered_songs, many=True)
        playlist_serializer = PlaylistSerializer(filtered_playlists, many=True)
        artist_serializer = ArtistSerializer(filtered_artists, many=True)
        response = {
            'songs': song_serializer.data,
            'playlists': playlist_serializer.data,
            'artists': artist_serializer.data,
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

    # def get_favourites(self, request, user_id):
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


# class FavouriteViewAPI(APIView):
#     authentication_classes = [BasicAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user_id = request.user.id

#         user_played_songs = UserPlayedSong.objects.filter(
#             played_song__accounts__id=user_id, liked=True)
#         user_played_songs_serializer = UserPlayedSongSerializer(
#             user_played_songs, many=True)

#         user_played_playlists = UserPlayedPlaylist.objects.filter(
#             played_playlist__accounts__id=user_id, liked=True)
#         user_played_playlists_serializer = UserPlayedPlaylistSerializer(
#             user_played_playlists, many=True)

#         response = {
#             'favourite_songs': user_played_songs_serializer.data,
#             'favourite_playlists': user_played_playlists_serializer.data,
#         }
#         return Response(response)
class FavouriteViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id

        user_played_songs = UserPlayedSong.objects.filter(
            account__id=user_id, liked=True)
        user_played_songs_serializer = UserPlayedSongSerializer(
            user_played_songs, many=True)

        user_played_playlists = UserPlayedPlaylist.objects.filter(
            account__id=user_id, liked=True)
        user_played_playlists_serializer = UserPlayedPlaylistSerializer(
            user_played_playlists, many=True)

        response = {
            'favourite_songs': user_played_songs_serializer.data,
            'favourite_playlists': user_played_playlists_serializer.data,
        }
        return Response(response)


class ProfileViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(account=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class CreateProfileAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        account = request.user

        serializer = ProfileSerializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save(account=account)
            return Response(serializer.data)
        except IntegrityError:
            return Response({'error': 'A profile already exists for this user.'})


class EditProfileAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def put(self, request, *arg, **kwarg):
        profile = Profile.objects.get(account=request.user)

        if not profile:
            return Response({'error': 'Profile not found.'})

        data = request.data.copy()
        serializer = ProfileSerializer(profile, data=data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ArtistViewAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]  # IsAdminGroup, IsUserGroup]

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
        artist_serializer = ArtistSerializer(artist, many=False)

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

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(account=request.user)

        serializer = FeaturesArtistSerializer(data=request.data.copy())
        serializer.is_valid(raise_exception=True)
        serializer.save(profile=profile)

        return Response(serializer.data)


class EditArtistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, ]  # IsAdminGroup, IsArtistGroup]
    serializer_class = ProfileSerializer

    def put(self, request, artist_id=None, *args, **kwargs):
        artist = get_object_or_404(Artist, id=artist_id)

        if not artist.profile:
            return Response({'error': 'Does not have any information about this artist.'})

        profile = artist.profile

        serializer = ProfileSerializer(
            profile, data=request.data.copy(), partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete(self, request, artist_id=None, *args, **kwargs):
        artist = get_object_or_404(Artist, id=artist_id)
        artist.delete()
        return Response('Artist was deleted!')


class SongsViewAPI(APIView):
    # authentication_classes = [BasicAuthentication]
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

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(account=request.user)
        main_artist = Artist.objects.get(profile=profile)

        serializer = FeaturesSongSerializer(data=request.data.copy())

        serializer.is_valid(raise_exception=True)
        serializer.save(main_artist=main_artist)

        return Response(serializer.data)


class EditSongAPI(APIView):
    authentication_classes = [BasicAuthentication]
    # IsAdminGroup, IsArtistGroup]
    permission_classes = [IsAuthenticated, IsSongOwner]
    serializer_class = FeaturesSongSerializer
    parser_classes = [MultiPartParser]

    def patch(self, request, song_id=None, *args, **kwargs):
        profile = Profile.objects.get(account=request.user)
        main_artist = Artist.objects.get(profile=profile)
        song = get_object_or_404(Song, id=song_id, main_artist=main_artist)
        field_to_old_value = {}
        for field in Song._meta.fields:
            if isinstance(field, models.FileField):
                field_name = field.name
                field_to_old_value[field_name] = getattr(song, field_name)

        for field_name, old_value in field_to_old_value.items():
            new_value = request.data.get(field_name, None)
            print(new_value)
            if new_value:
                if old_value:
                    old_file_path = os.path.join(MEDIA_ROOT, str(old_value))
                    print(old_file_path)
                    if os.path.exists(old_file_path):
                        print(True)
                        os.remove(old_file_path)
            else:
                request.data[field_name] = old_value

        serializer = FeaturesSongSerializer(
            song, data=request.data.copy(), partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete(self, request, song_id=None, *args, **kwargs):
        song = get_object_or_404(Song, id=song_id)

        song.delete()
        return Response('Song was deleted!')


class AddSongToPlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, IsPlaylistOwner]

    def post(self, request, song_id=None, playlist_id=None, *args, **kwargs):
        playlist = get_object_or_404(
            Playlist, id=playlist_id, account=request.user)
        song = get_object_or_404(Song, id=song_id)
        playlist.songs.add(song)

        return Response({'message': 'Song added to playlist successfully.'})


class PlaySongAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, song_id=None, *args, **kwargs):
        song = get_object_or_404(Song, id=song_id)
        account = request.user if request.user.is_authenticated else None
        if account:
            played_song, _ = PlayedSong.objects.get_or_create(song=song)

            _, _ = UserPlayedSong.objects.get_or_create(
                account=request.user,
                played_song=played_song,
                defaults={'liked': False, }
            )

        song.listens += 1
        song.save()

        song_url = song.song_file.url if song.song_file else None
        if not song_url:
            return Response({'song_url': "File is not exist.", 'message': 'Song played successfully'})
        return Response({'song_url': song_url, 'message': 'Song played successfully'})


class LikeSongAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated,]  # IsAdminGroup, IsUserGroup]

    def post(self, request, song_id, *args, **kwargs):
        song = get_object_or_404(Song, id=song_id)

        played_song, _ = PlayedSong.objects.get_or_create(song=song)

        user_played_song, created = UserPlayedSong.objects.get_or_create(
            account=request.user,
            played_song=played_song,
            defaults={'liked': True}
        )

        if not created:
            user_played_song.liked = True if user_played_song.liked == False else False
            user_played_song.save()
        song.save()

        if user_played_song.liked:
            return Response({'message': 'Song liked successfully'})
        return Response({'message': 'Song unliked successfully'})


class PlaylistsViewAPI(APIView):
    # authentication_classes = [BasicAuthentication]
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

    def post(self, request, *args, **kwargs):
        serializer = CreatePlaylistSerializer(data=request.data.copy())
        serializer.is_valid(raise_exception=True)
        serializer.save(account=request.user)

        return Response(serializer.data)


class EditPlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, IsPlaylistOwner]
    serializer_class = EditPlaylistSerializer

    def patch(self, request, playlist_id=None, *args, **kwargs):
        playlist = get_object_or_404(
            Playlist, id=playlist_id, account=request.user)

        serializer = EditPlaylistSerializer(
            playlist, data=request.data.copy(), partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete(self, request, playlist_id=None, *args, **kwargs):
        playlist = get_object_or_404(Playlist, id=playlist_id)

        playlist.delete()
        return Response('Playlist was deleted!')


class SongsOfPlaylistAPI(APIView):
    permission_classes = [AllowAny]

    def get(self, request, playlist_id=None):
        playlist = get_object_or_404(Playlist, id=playlist_id)
        serializer = SongsOfPlaylistSerializer(playlist, many=False)
        return Response(serializer.data)


class RemoveSongFromPlaylist(APIView):
    permission_classes = [IsAuthenticated, IsPlaylistOwner]

    def post(self, request, playlist_id=None, song_id=None, *args, **kwargs):
        playlist = get_object_or_404(
            Playlist, id=playlist_id, account=request.user)
        song = get_object_or_404(Song, id=song_id)
        playlist.songs.remove(song)

        return Response({'message': 'Song removed from playlist successfully.'})


class PlayPlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, playlist_id=None, *args, **kwargs):
        playlist = get_object_or_404(Playlist, id=playlist_id)
        account = request.user if request.user.is_authenticated else None
        if account:
            played_playlist, _ = PlayedPlaylist.objects.get_or_create(
                playlist=playlist)

            _, _ = UserPlayedPlaylist.objects.get_or_create(
                account=self.request.user,
                played_playlist=played_playlist,
                defaults={'liked': False}
            )

        song_data = []
        for song in playlist.songs.all():
            song_url = song.song_file.url if song.song_file else None
            song_data.append({
                'song_name': song.name,
                'song_url': song_url
            })

        return Response({'message': 'Playlist played successfully', 'songs': song_data})


class LikePlaylistAPI(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, playlist_id=None, *args, **kwargs):
        playlist = get_object_or_404(Playlist, id=playlist_id)

        played_playlist, _ = PlayedPlaylist.objects.get_or_create(
            playlist=playlist)

        user_played_playlist, created = UserPlayedPlaylist.objects.get_or_create(
            account=self.request.user,
            played_playlist=played_playlist,
            defaults={'liked': True}
        )

        if not created:
            user_played_playlist.liked = True
            user_played_playlist.save()

        return Response({'message': 'Playlist liked successfully'})
