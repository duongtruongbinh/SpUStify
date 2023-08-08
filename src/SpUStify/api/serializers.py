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
        fields = ('id', 'artist_name')

class FeaturesArtistSerializer(ModelSerializer):
    artist_profile = serializers.CharField(required = False)
    class Meta:
        model = Artist
        fields = ('artist_name', 'artist_profile')
        
    def create(self, validated_data):
        artist_profile_data = validated_data.pop('artist_profile', None)
        if artist_profile_data:
            artist_profile = Profile.objects.get(full_name=artist_profile_data)
            artist = Artist.objects.create(profile=artist_profile, **validated_data)
        else:
            artist = Artist.objects.create(**validated_data)
        return artist
        
class SongSerializer(ModelSerializer):
    song_artists = SerializerMethodField()

    def get_song_artists(self, song):
        artists = Artist.objects.filter(Q(id=song.main_artist.id) | Q(collabartist__song=song)).distinct()
        return [artist.artist_name for artist in artists]

    class Meta:
        model = Song
        fields = ('id', 'avatar', 'name', 'song_artists')

class DetailSongSerializer(ModelSerializer):
    lyric_data = SerializerMethodField()

    def get_lyric_data(self, song):
        if song.lyric_file:
            with song.lyric_file.open() as file:
                lyric_data = file.read()
            return lyric_data.decode('utf-8')  # Assuming lyric file is in utf-8 encoding
        return None

    class Meta:
        model = Song
        fields = ('name', 'lyric_data', 'avatar', 'background_image')
        
class MainArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainArtist
        fields = ('artist',)

class CollabArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollabArtist
        fields = ('artist',)

class FeaturesSongSerializer(serializers.ModelSerializer):
    main_artist_name = serializers.CharField()
    collab_artists_names = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Song
        fields = ('name', 'song_file', 'lyric_file', 'avatar', 'background_image', 'main_artist_name', 'collab_artists_names')

    def create(self, validated_data):
        main_artist_name = validated_data.pop('main_artist_name', None)
        collab_artists_names = validated_data.pop('collab_artists_names', [])

        main_artist, _ = Artist.objects.get_or_create(artist_name=main_artist_name)
        song = Song.objects.create(main_artist=main_artist, **validated_data)

        for collab_artist_name in collab_artists_names:
            collab_artist, _ = Artist.objects.get_or_create(artist_name=collab_artist_name)
            CollabArtist.objects.create(song=song, artist=collab_artist)

        return song

class EditSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('name', 'song_file', 'lyric_file', 'avatar', 'background_image')

class PlaylistSerializer(ModelSerializer):
    playlist_songs = SerializerMethodField()
    playlist_status = SerializerMethodField()

    def get_playlist_songs(self, playlist):
        return [song.name for song in playlist.songs.all()]

    def get_playlist_status(self, playlist):
        return 'public' if playlist.status == 'pub' else 'private'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['playlist_songs'] = self.get_playlist_songs(instance)
        representation['playlist_status'] = self.get_playlist_status(instance)
        return representation

    class Meta:
        model = Playlist
        fields = ('id', 'name', 'playlist_status', 'playlist_songs')

class FeaturesPlaylistSerializer(ModelSerializer):
    class Meta:
        model = Playlist
        fields = ('name', 'status', 'avatar', 'background_image')

class AddSongToPlaylistSerializer(ModelSerializer):
    playlist_id = serializers.PrimaryKeyRelatedField(queryset=Playlist.objects.all(), write_only=True)
    #song_id = serializers.PrimaryKeyRelatedField(queryset=Song.objects.all())

    class Meta:
        model = Playlist
        fields = ['playlist_id']

class CreateUserPlayedSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPlayedSong
        fields = '__all__'

class CreatePlayedSongSerializer(serializers.ModelSerializer):
    user_played_songs = CreateUserPlayedSongSerializer(many=True, read_only=True)
    
    class Meta:
        model = PlayedSong
        fields = '__all__'
        
class PlayedSongSerializer(ModelSerializer):
    song_name = serializers.CharField(source='song.name', read_only=True)
    artist_name = serializers.SerializerMethodField()

    def get_artist_name(self, played_song):
        artists = Artist.objects.filter(Q(id=played_song.song.main_artist.id) | Q(collabartist__song=played_song.song)).distinct()
        return [artist.artist_name for artist in artists]

    class Meta:
        model = PlayedSong
        fields = ['song_name', 'artist_name']


class UserPlayedSongSerializer(ModelSerializer):
    song_name = serializers.CharField(source='played_song.song.name', read_only=True)
    artist_name = serializers.SerializerMethodField()

    def get_artist_name(self, user_played_song):
        artists = Artist.objects.filter(Q(id=user_played_song.played_song.song.main_artist.id) | Q(collabartist__song=user_played_song.played_song.song)).distinct()
        return [artist.artist_name for artist in artists]
    
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
            artist_data = [artist.artist_name for artist in artists]
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
