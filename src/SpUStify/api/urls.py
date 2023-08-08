from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_routes, name="routes"),
    path('register/', views.RegisterAPI.as_view(), name="register"),
    path('login/', views.LoginAPI.as_view(), name="login"),
    
    path('accounts/', views.AccountsPageAPI.as_view(), name="list_of_accounts"),
    path('home/', views.HomePageAPI.as_view(), name="home"),
    path('home/<str:feature>/', views.HomePageAPI.as_view(), name="feature_home"),
    path('your_profile/', views.ProfilePageAPI.as_view(), name="your_profile"),
    
    path('artists/', views.ArtistsPageAPI.as_view(), name="artists"),
    path('artists/<str:artist_id>/', views.DetailArtistAPI.as_view(), name="artist_detail"),
    
    path('songs/', views.SongsPageAPI.as_view(), name="songs"),
    path('songs/<str:song_id>/', views.DetailSongPageAPI.as_view(), name="song_detail"),
    path('songs/<str:song_id>/add-song-to-playlist/', views.AddSongToPlaylistAPI.as_view(), name='add_song_to_playlist'),
    path('songs/<str:song_id>/play-song/', views.PlaySongAPI.as_view(), name='play_song'),
    path('songs/<str:song_id>/like-song/', views.LikeSongAPI.as_view(), name='like_song'),
    
    path('playlists/', views.PlaylistsPageAPI.as_view(), name="playlists"),
    path('playlists/<str:playlist_id>/', views.DetailPlaylistAPI.as_view(), name="playlist_detail"),
    path('playlists/<str:playlist_id>/play-playlist/', views.PlayPlaylistAPI.as_view(), name='play_playlist'),
    path('playlists/<str:playlist_id>/like-playlist/', views.LikePlaylistAPI.as_view(), name='like_playlist'),
]