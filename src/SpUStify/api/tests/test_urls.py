from django.test import SimpleTestCase
from django.urls import reverse, resolve
from api.views import *

class TestUrls(SimpleTestCase):
    def test_register_url_resolves(self):
        url = reverse('register')
        self.assertEqual(resolve(url).func.view_class, RegisterAPI)
        
    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func.view_class, LoginAPI)
        
    def test_get_accounts_url_resolves(self):
        url = reverse('get_accounts')
        self.assertEqual(resolve(url).func.view_class, AccountViewAPI)
        
    def test_get_account_url_resolves(self):
        url = reverse('get_account', args=['3'])
        self.assertEqual(resolve(url).func.view_class, AccountViewAPI)
        
    def test_edit_account_url_resolves(self):
        url = reverse('edit_account', args=['3'])
        self.assertEqual(resolve(url).func.view_class, EditAccountAPI)
        
    def test_get_homepage_url_resolves(self):
        url = reverse('get_homepage')
        self.assertEqual(resolve(url).func.view_class, HomeViewAPI)
    
    def test_get_feature_url_resolves(self):
        url = reverse('get_feature', args=['feature'])
        self.assertEqual(resolve(url).func.view_class, HomeFeaturesAPI)
        
    def test_get_profile_url_resolves(self):
        url = reverse('get_profile')
        self.assertEqual(resolve(url).func.view_class, ProfileViewAPI)
        
    def test_create_profile_url_resolves(self):
        url = reverse('create_profile')
        self.assertEqual(resolve(url).func.view_class, CreateProfileAPI)
        
    def test_edit_profile_url_resolves(self):
        url = reverse('edit_profile')
        self.assertEqual(resolve(url).func.view_class, EditProfileAPI)
    
    def test_get_artists_url_resolves(self):
        url = reverse('get_artists')
        self.assertEqual(resolve(url).func.view_class, ArtistViewAPI)
        
    def test_create_artist_url_resolves(self):
        url = reverse('create_artist')
        self.assertEqual(resolve(url).func.view_class, CreateArtistAPI)
        
    def test_get_artist_url_resolves(self):
        url = reverse('get_artist', args=['3'])
        self.assertEqual(resolve(url).func.view_class, ArtistViewAPI)
        
    def test_like_song_url_resolves(self):
        url = reverse('edit_artist', args=['3'])
        self.assertEqual(resolve(url).func.view_class, EditArtistAPI)
    
    def test_get_songs_url_resolves(self):
        url = reverse('get_songs')
        self.assertEqual(resolve(url).func.view_class, SongsViewAPI)
    
    def test_create_song_url_resolves(self):
        url = reverse('create_song')
        self.assertEqual(resolve(url).func.view_class, CreateSongAPI)
        
    def test_get_song_url_resolves(self):
        url = reverse('get_song', args=['3'])
        self.assertEqual(resolve(url).func.view_class, SongsViewAPI)
        
    def test_edit_song_url_resolves(self):
        url = reverse('edit_song', args=['3'])
        self.assertEqual(resolve(url).func.view_class, EditSongAPI)

    def test_add_song_to_playlist_url_resolves(self):
        url = reverse('add_song_to_playlist', args=['3'])
        self.assertEqual(resolve(url).func.view_class, AddSongToPlaylistAPI)
        
    def test_play_song_url_resolves(self):
        url = reverse('play_song', args=['3'])
        self.assertEqual(resolve(url).func.view_class, PlaySongAPI)
        
    def test_like_song_url_resolves(self):
        url = reverse('like_song', args=['3'])
        self.assertEqual(resolve(url).func.view_class, LikeSongAPI)
        
    def test_download_song_url_resolves(self):
        url = reverse('download_song', args=['3'])
        self.assertEqual(resolve(url).func.view_class, DownloadSongAPI)
        
    def test_get_playlists_url_resolves(self):
        url = reverse('get_playlists')
        self.assertEqual(resolve(url).func.view_class, PlaylistsViewAPI)
    
    def test_create_playlist_url_resolves(self):
        url = reverse('create_playlist')
        self.assertEqual(resolve(url).func.view_class, CreatePlaylistAPI)
    
    def test_get_playlist_url_resolves(self):
        url = reverse('get_playlist', args=['3'])
        self.assertEqual(resolve(url).func.view_class, PlaylistsViewAPI)
        
    def test_edit_playlist_url_resolves(self):
        url = reverse('edit_playlist', args=['3'])
        self.assertEqual(resolve(url).func.view_class, EditPlaylistAPI)
        
    def test_play_playlist_url_resolves(self):
        url = reverse('play_playlist', args=['3'])
        self.assertEqual(resolve(url).func.view_class, PlayPlaylistAPI)
        
    def test_like_playlist_url_resolves(self):
        url = reverse('like_playlist', args=['3'])
        self.assertEqual(resolve(url).func.view_class, LikePlaylistAPI)
        
    def test_get_your_playlists_url_resolves(self):
        url = reverse('get_your_playlists')
        self.assertEqual(resolve(url).func.view_class, YourPlaylistsViewAPI)
        
    def test_get_your_playlist_url_resolves(self):
        url = reverse('get_your_playlist', args=['3'])
        self.assertEqual(resolve(url).func.view_class, YourPlaylistsViewAPI)
        
    
    
    