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
    is_artist = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_artist')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        is_artist = validated_data.pop('is_artist', False)

        # Check if the group exists, otherwise create it
        group_name = 'Artist' if is_artist else 'User'
        group, _ = Group.objects.get_or_create(name=group_name)

        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        
        # Add the user to the selected group
        group.user_set.add(user)

        return user
    

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = ('avatar', 'background_image', 'full_name', 'dob', 'email', 'phone')

class ArtistSerializer(ModelSerializer):
    class Meta:
        model = Artist
        fields = ('id', 'artist_name')

class FeaturesArtistSerializer(ModelSerializer):
    class Meta:
        model = Artist
        fields = ['artist_name']
        
class SongSerializer(ModelSerializer):
    song_artists = SerializerMethodField()

    def get_song_artists(self, song):
        artists = Artist.objects.filter(Q(id=song.main_artist.id)).distinct()
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
        fields = ('avatar', 'background_image', 'name', 'lyric_data')

class FeaturesSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('avatar', 'background_image', 'name', 'song_file', 'lyric_file')

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
        fields = ('id', 'avatar', 'background_image', 'name', 'status', 'songs')
        
class CreatePlaylistSerializer(ModelSerializer):
    class Meta:
        model = Playlist
        fields = ('avatar', 'background_image', 'name', 'status')

class EditPlaylistSerializer(ModelSerializer):
    songs = SongSerializer(many=True)
    class Meta:
        model = Playlist
        fields = ('avatar', 'background_image', 'name', 'status', 'songs')

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
        artists = Artist.objects.filter(Q(id=played_song.song.main_artist.id)).distinct()
        return [artist.artist_name for artist in artists]

    class Meta:
        model = PlayedSong
        fields = ['song_name', 'artist_name']


class UserPlayedSongSerializer(ModelSerializer):
    song_name = serializers.CharField(source='played_song.song.name', read_only=True)
    artist_name = serializers.SerializerMethodField()

    def get_artist_name(self, user_played_song):
        artists = Artist.objects.filter(Q(id=user_played_song.played_song.song.main_artist.id)).distinct()
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
            artists = Artist.objects.filter(Q(id = song.main_artist.id)).distinct()
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
            artists = Artist.objects.filter(Q(id = song.main_artist.id)).distinct()
            artist_data = [artist.artist_name for artist in artists]
            song_data.append({
                'song_name': song.name,
                'artist_names': artist_data
            })
        return song_data
    
    class Meta:
        model = UserPlayedPlaylist
        fields = ['playlist_name', 'songs']
