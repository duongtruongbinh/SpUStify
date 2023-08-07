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

# Register Serializer
class RegisterSerializer(ModelSerializer):
    is_artist = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_artist')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        is_artist = validated_data.pop('is_artist', False)

        # Check if the group exists, otherwise create it
        group_name = 'Artist' if is_artist else 'User'
        group, created = Group.objects.get_or_create(name=group_name)

        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        
        # Add the user to the selected group
        group.user_set.add(user)

        return user
    

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = ('full_name', 'dob', 'email', 'phone', 'avatar', 'background_image')

class ArtistSerializer(ModelSerializer):
    class Meta:
        model = Artist
        fields = ('name', 'avatar', 'background_image')

class SongSerializer(ModelSerializer):
    artists = SerializerMethodField()

    def get_artists(self, song):
        artists = Artist.objects.filter(Q(id=song.main_artist.id) | Q(collabartist__song=song)).distinct()
        return [artist.name for artist in artists]

    class Meta:
        model = Song
        fields = ('id', 'name', 'artists')

        
class MainArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainArtist
        fields = ('artist',)

class CollabArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollabArtist
        fields = ('artist',)

class FeaturesSongSerializer(serializers.ModelSerializer):
    main_artist = serializers.CharField()
    collab_artists = serializers.ListField(child=serializers.CharField(), required = False)

    class Meta:
        model = Song
        fields = ('name', 'song_file', 'lyric_file', 'avatar', 'background_image', 'main_artist', 'collab_artists')

    def create(self, validated_data):
        main_artist_data = validated_data.pop('main_artist', None)
        collab_artists_data = validated_data.pop('collab_artists', [])

        # Create or get the main_artist object
        main_artist, _ = Artist.objects.get_or_create(name=main_artist_data)

        # Create the song object with main_artist as a ForeignKey
        song = Song.objects.create(main_artist=main_artist, **validated_data)

        # Create collab artists and associate them with the song
        for collab_artist_name in collab_artists_data:
            collab_artist, _ = Artist.objects.get_or_create(name=collab_artist_name)
            CollabArtist.objects.create(song=song, artist=collab_artist)

        return song


class PlaylistSerializer(ModelSerializer):
    songs = SerializerMethodField()
    status = SerializerMethodField()

    def get_songs(self, playlist):
        return [song.name for song in playlist.songs.all()]

    def get_status(self, playlist):
        return 'public' if playlist.status == 'pub' else 'private'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['songs'] = self.get_songs(instance)
        return representation

    class Meta:
        model = Playlist
        fields = ['name', 'status', 'songs']


class PlayedSongSerializer(ModelSerializer):
    song_name = serializers.CharField(source='song.name', read_only=True)
    artist_name = serializers.SerializerMethodField()

    def get_artist_name(self, played_song):
        artists = Artist.objects.filter(Q(mainartist__song=played_song.song) | Q(collabartist__song=played_song.song)).distinct()
        return [artist.name for artist in artists]

    class Meta:
        model = PlayedSong
        fields = ['song_name', 'artist_name']


class UserPlayedSongSerializer(ModelSerializer):
    song_name = serializers.CharField(source='played_song.song.name', read_only=True)
    artist_name = serializers.SerializerMethodField()

    def get_artist_name(self, user_played_song):
        artists = Artist.objects.filter(Q(mainartist__song=user_played_song.played_song.song) | Q(collabartist__song=user_played_song.played_song.song)).distinct()
        return [artist.name for artist in artists]
    
    class Meta:
        model = UserPlayedSong
        fields = ['song_name', 'artist_name']


class PlayedPlaylistSerializer(serializers.ModelSerializer):
    playlist_name = serializers.CharField(source='playlist.name', read_only=True)
    songs = serializers.SerializerMethodField()

    def get_songs(self, played_playlist):
        song_data = []
        for song in played_playlist.playlist.songs.all():
            artists = Artist.objects.filter(Q(mainartist__song=song) | Q(collabartist__song=song)).distinct()
            artist_data = [artist.name for artist in artists]
            song_data.append({
                'song_name': song.name,
                'artist_names': artist_data
            })
        return song_data

    class Meta:
        model = PlayedPlaylist
        fields = ['playlist_name', 'songs']



class UserPlayedPlaylistSerializer(ModelSerializer):
    playlist_name = serializers.CharField(source='played_playlist.playlist.name', read_only=True)
    songs = serializers.SerializerMethodField()

    def get_songs(self, user_played_playlist):
        song_data = []
        for song in user_played_playlist.played_playlist.playlist.songs.all():
            artists = Artist.objects.filter(Q(mainartist__song=song) | Q(collabartist__song=song)).distinct()
            artist_data = [artist.name for artist in artists]
            song_data.append({
                'song_name': song.name,
                'artist_names': artist_data
            })
        return song_data
    
    class Meta:
        model = UserPlayedPlaylist
        fields = ['playlist_name', 'songs']
