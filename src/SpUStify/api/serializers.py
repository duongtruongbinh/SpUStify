from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework import serializers
from .models import *
from django.db.models import Q
from django.contrib.auth.models import Group

# User Serializer


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class DetailUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# Register Serializer


class RegisterSerializer(ModelSerializer):
    is_artist = serializers.BooleanField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_artist')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        is_artist = validated_data['is_artist']

        # Check if the group exists, otherwise create it
        group_name = 'Artists' if is_artist else 'Users'
        group, _ = Group.objects.get_or_create(name=group_name)

        user = User.objects.create_user(
            validated_data['username'], validated_data['email'], validated_data['password'])

        # Add the user to the selected group
        group.user_set.add(user)
        profile = Profile.objects.create(full_name=user.username, account=user)
        artist = Artist.objects.create(
            artist_name=user.username, profile=profile)
        return user


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = ('avatar', 'background_image',
                  'full_name', 'dob', 'email', 'phone')


class ArtistSerializer(ModelSerializer):
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, artist):
        return artist.profile.avatar.url if artist.profile.avatar else None

    class Meta:
        model = Artist
        fields = ('id', 'artist_name', 'avatar')


class FeaturesArtistSerializer(ModelSerializer):
    class Meta:
        model = Artist
        fields = ['artist_name']


class SongSerializer(ModelSerializer):
    main_artist = ArtistSerializer(many=False)

    class Meta:
        model = Song
        fields = ('id', 'avatar', 'name', 'main_artist',
                  'song_file', 'lyric_file')


class DetailSongSerializer(ModelSerializer):
    lyric_data = SerializerMethodField()
    main_artist = ArtistSerializer(many=False)

    def get_lyric_data(self, song):
        if song.lyric_file:
            with song.lyric_file.open() as file:
                lyric_data = file.read()
            # Assuming lyric file is in utf-8 encoding
            return lyric_data.decode('utf-8')
        return None

    class Meta:
        model = Song
        fields = ('avatar', 'background_image', 'name',
                  'lyric_data', 'song_file', 'main_artist')


class FeaturesSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('avatar', 'background_image',
                  'name', 'song_file', 'lyric_file')


class PlaylistSerializer(ModelSerializer):
    class Meta:
        model = Playlist
        fields = ('id', 'avatar', 'name')


class DetailPlaylistSerializer(ModelSerializer):
    songs = SongSerializer(many=True)
    status = SerializerMethodField()

    def get_status(self, playlist):
        return 'public' if playlist.status == 'pub' else 'private'

    class Meta:
        model = Playlist
        fields = ('id', 'avatar', 'background_image',
                  'name', 'status', 'songs')


class CreatePlaylistSerializer(ModelSerializer):
    class Meta:
        model = Playlist
        fields = ('avatar', 'background_image', 'name', 'status')


class EditPlaylistSerializer(ModelSerializer):
    # songs = SongSerializer(many=True)

    class Meta:
        model = Playlist
        fields = ('avatar', 'background_image', 'name', 'status')


class SongsOfPlaylistSerializer(ModelSerializer):
    songs = SongSerializer(many=True)

    class Meta:
        model = Playlist
        fields = ['songs']


class PlayedSongSerializer(ModelSerializer):
    song = SongSerializer(many=False)

    class Meta:
        model = PlayedSong
        fields = ['song']


class UserPlayedSongSerializer(ModelSerializer):
    played_song = SerializerMethodField()

    def get_played_song(self, user_played_song):
        played_song_data = SongSerializer(
            user_played_song.played_song.song).data
        return played_song_data

    class Meta:
        model = UserPlayedSong
        fields = ['played_song']


class PlayedPlaylistSerializer(serializers.ModelSerializer):
    playlist = PlaylistSerializer(many=False)

    class Meta:
        model = PlayedPlaylist
        fields = ['playlist']


class UserPlayedPlaylistSerializer(ModelSerializer):
    played_playlist = SerializerMethodField()

    def get_played_playlist(self, user_played_playlist):
        played_playlist_data = PlaylistSerializer(
            user_played_playlist.played_playlist.playlist).data
        return played_playlist_data

    class Meta:
        model = UserPlayedPlaylist
        fields = ['played_playlist']
