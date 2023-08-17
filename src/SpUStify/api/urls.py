from django.urls import path
from knox import views as knox_views
from .views import *

urlpatterns = [
    #path('', get_routes, name="routes"),
    # Register, Login, Logout Page
    path('register/', RegisterAPI.as_view(), name="register"),
    path('login/', LoginAPI.as_view(), name="login"),
    path('logout/', knox_views.LogoutView.as_view(), name = 'logout'),
    
    # Account Page
    path('accounts/', AccountViewAPI.as_view(), name="get_accounts"),
    # Detail Account Page
    path('accounts/<str:account_id>', AccountViewAPI.as_view(), name="get_account"),
    path('accounts/<str:account_id>/edit', EditAccountAPI.as_view(), name="edit_account"),
    
    # Home Page
    path('home/', HomeViewAPI.as_view(), name="get_homepage"),
    path('home/<str:feature>/', HomeFeaturesAPI.as_view(), name="get_homepage_features"),
    
    # Profile Page
    path('profile/', ProfileViewAPI.as_view(), name="get_profile"),
    path('profile/create/', CreateProfileAPI.as_view(), name="create_profile"),
    path('profile/edit/', EditProfileAPI.as_view(), name="edit_profile"),
    
    # Artists Page
    path('artists/', ArtistViewAPI.as_view(), name="get_artists"),
    path('artists/create/', CreateArtistAPI.as_view(), name="create_artist"),
    # Detail Artist Page
    path('artists/<str:artist_id>/', ArtistViewAPI.as_view(), name="get_artist"),
    path('artists/<str:artist_id>/edit/', EditArtistAPI.as_view(), name="edit_artist"),
    
    # Songs Page
    path('songs/', SongsViewAPI.as_view(), name="get_songs"),
    path('songs/create', CreateSongAPI.as_view(), name="create_song"),
    # Detail Song Page
    path('songs/<str:song_id>/', SongsViewAPI.as_view(), name="get_song"),
    path('songs/<str:song_id>/edit/', EditSongAPI.as_view(), name="edit_song"),
    path('songs/<str:song_id>/add-to-playlist/', AddSongToPlaylistAPI.as_view(), name='add_song_to_playlist'),
    path('songs/<str:song_id>/play/', PlaySongAPI.as_view(), name='play_song'),
    path('songs/<str:song_id>/like/', LikeSongAPI.as_view(), name='like_song'),
    path('songs/<str:song_id>/download/', DownloadSongAPI.as_view(), name='download_song'),
    
    # Playlists Page
    path('playlists/', PlaylistsViewAPI.as_view(), name="get_playlists"),
    path('playlists/create', CreatePlaylistAPI.as_view(), name="create_playlist"),
    # Detail Playlist Page
    path('playlists/<str:playlist_id>/', PlaylistsViewAPI.as_view(), name="get_playlist"),
    path('playlists/<str:playlist_id>/edit/', EditPlaylistAPI.as_view(), name="edit_playlist"),
    path('playlists/<str:playlist_id>/play/', PlayPlaylistAPI.as_view(), name='play_playlist'),
    path('playlists/<str:playlist_id>/like/', LikePlaylistAPI.as_view(), name='like_playlist'),
    path('your_playlists/', YourPlaylistsViewAPI.as_view(), name="get_your_playlists"),
    path('your_playlists/<str:playlist_id>', YourPlaylistsViewAPI.as_view(), name="get_your_playlist"),
]