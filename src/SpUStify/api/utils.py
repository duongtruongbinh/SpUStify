from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login


def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

def getAccountsList(request):
    accounts = User.objects.all().order_by('id')
    serializers = UserSerializer(accounts, many = True)
    return Response(serializers.data)

def deleteAccount(request, pk):
    account = User.objects.get(id=pk)
    account.delete()
    return Response('Account was deleted!')

def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

def search(request):
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

    # Get leaderboard data
    songsByListens = Song.objects.order_by('-listens')[:2]
    listens_serializer = SongSerializer(songsByListens, many=True)

    songsByLikes = Song.objects.order_by('-likes')[:2]
    likes_serializer = SongSerializer(songsByLikes, many=True)

    # Get recommendation data
    user_id = request.user.id  # ID of the authenticated user
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
    recommended_playlists = Playlist.objects.filter(id__in=favorite_playlist_ids.exclude(id__in=played_playlist_ids))
    recommended_playlists_serializer = PlaylistSerializer(recommended_playlists, many=True)

    # Serialize the results
    song_serializer = SongSerializer(songs, many=True)
    playlist_serializer = PlaylistSerializer(playlists, many=True)

    response = {
        'songs': song_serializer.data,
        'playlists': playlist_serializer.data,
        'leaderboard_by_likes': likes_serializer.data,
        'leaderboard_by_listens': listens_serializer.data,
        'recommended_songs': recommended_songs_serializer.data,
        'recommended_playlists': recommended_playlists_serializer.data,
    }

    return Response(response)


def getLeaderboard(request):
    songsByListens = Song.objects.order_by('-listens')[:2]
    listens_serializer = SongSerializer(songsByListens, many=True)
    
    songsByLikes = Song.objects.order_by('-likes')[:2]
    likes_serializer = SongSerializer(songsByLikes, many=True)
    
    response = {
        'Leaderboard by likes': likes_serializer.data,
        'Leaderboard by listens': listens_serializer.data,
    }
    return Response(response)

def getArtistsList(request):
    query = request.query_params.get('query', '')
    # Filter songs based on the search query
    artists = Artist.objects.filter(Q(name__icontains=query))
    serializer = ArtistSerializer(artists, many = True)
    return Response(serializer.data)

def getArtistDetail(request, pk):
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
    
# def getSongsList(request):
#     query = request.query_params.get('query', '')
#     # Filter songs based on the search query
#     songs = Song.objects.filter(Q(name__icontains=query))
#     if not songs.exists():
#         # If no exact match found, try to find songs with similar names
#         similar_songs = Song.objects.filter(name__icontains=query)
#         if similar_songs.exists():
#             songs = similar_songs
#     serializer = SongSerializer(songs, many=True)
#     return Response(serializer.data)

# def getSongDetail(request, pk):
#     song = get_object_or_404(Song, id=pk)
#     serializer = SongSerializer(song, many=False)
    
#     main_artist = get_object_or_404(MainArtist, song_id=pk)
#     related_songs = MainArtist.objects.filter(artist=main_artist.artist).exclude(song=song)
#     songs = [related_song.song for related_song in related_songs]
    
#     related_serializer = SongSerializer(songs, many=True)
    
#     response = {
#         'Song': serializer.data,
#         'Related Songs': related_serializer.data,
#     }
    
#     return Response(response)

# def createSong(request):
#     # Lấy thông tin tài khoản người dùng
#     account = request.user

#     # Lấy dữ liệu từ request
#     name = request.data.get('name', '')
#     likes = request.data.get('likes', 0)
#     listens = request.data.get('listens', 0)
#     song_file = request.FILES.get('song_file')
#     lyric_file = request.FILES.get('lyric_file')
#     avatar = request.FILES.get('avatar')
#     background_image = request.FILES.get('background_image')
#     created_date = request.data.get('created_date')

#     # Tạo instance của SongSerializer với các trường dữ liệu
#     serializer = SongSerializer(data={
#         'name': name,
#         'likes': likes,
#         'listens': listens,
#         'song_file': song_file,
#         'lyric_file': lyric_file,
#         'avatar': avatar,
#         'background_image': background_image,
#         'created_date': created_date,
#         'account': account.id,  # Lưu ID của tài khoản
#         # Các trường khác của model Song mà bạn muốn lấy từ dữ liệu
#     })

#     serializer.is_valid(raise_exception=True)
#     serializer.save()
#     return Response(serializer.data, status=status.HTTP_201_CREATED)

#     # serializer = SongSerializer(data=request.data, context={'request': request})
#     # serializer.is_valid(raise_exception=True)
#     # serializer.save()
#     # return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# def deleteSong(request, pk):
#     song = Song.objects.get(id=pk)
#     song.delete()
#     return Response('Song was deleted!')

def getPlaylistsList(request):
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

def getYourPlaylists(request):
    user_id = request.user.id 
    playlists = Playlist.objects.filter(account__id=user_id)
    serializers = PlaylistSerializer(playlists, many = True)
    return Response(serializers.data)

def getPlaylistDetail(request, pk):
    playlist = Playlist.objects.get(id=pk)
    serializer = PlaylistSerializer(playlist, many = False)
    return Response(serializer.data)

def createPlaylist(request):
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
    
def deletePlaylist(request, pk):
    playlist = Playlist.objects.get(id=pk)
    playlist.delete()
    return Response('Playlist was deleted!')

def getHistory(request):
    user_id = request.user.id  # ID of the authenticated user
    playedSongs = PlayedSong.objects.filter(accounts__id=user_id)
    playedPlaylists = PlayedPlaylist.objects.filter(accounts__id=user_id)
    playedSong_serializer = PlayedSongSerializer(playedSongs, many=True)
    playedPlaylists_serializer = PlayedPlaylistSerializer(playedPlaylists, many=True)
    
    response = {
        'playedSongs': playedSong_serializer.data,
        'playedPlaylists': playedPlaylists_serializer.data,
    }
    return Response(response)

def getFavourite(request):
    user_id = request.user.id  # ID of the authenticated user
    userPlayedSongs = UserPlayedSong.objects.filter(played_song__accounts__id=user_id, liked = True )
    userPlayedSongs_serializer = UserPlayedSongSerializer(userPlayedSongs, many=True)
    
    userPlayedPlaylists = UserPlayedPlaylist.objects.filter(played_playlist__accounts__id=user_id, liked = True )
    userPlayedPlaylists_serializer = UserPlayedPlaylistSerializer(userPlayedPlaylists, many=True)
    
    response = {
        'playedSongs': userPlayedSongs_serializer.data,
        'playedPlaylists': userPlayedPlaylists_serializer.data,
    }
    return Response(response)

def getRecommend(request):
    user_id = request.user.id  # ID of the authenticated user
    
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


