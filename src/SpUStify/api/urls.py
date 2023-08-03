from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('register/', views.RegisterAPI.as_view(), name = "register"),
    path('login/', views.LoginAPI.as_view(), name = "login"),
    path('accounts/', views.AccountsPageAPI.as_view(), name="list of accounts"),
    path('home/', views.HomePageAPI.as_view(), name="homepage"),
    path('home/<str:feature>/', views.HomePageAPI.as_view(), name="feature of homepage"),
    # path('home/your_profile/', views.ProfilePage.as_view(), name="your profile"),
    path('home/artists/', views.ArtistsPageAPI.as_view(), name="artists"),
    path('home/artists/<str:pk>/', views.ArtistsPageAPI.as_view(), name="artist detail"),
    path('home/songs/', views.SongsPageAPI.as_view(), name="songs"),
    path('home/songs/<str:pk>/', views.SongsPageAPI.as_view(), name="detailed song"),
    path('home/playlists/', views.PlaylistsPageAPI.as_view(), name="playlists"),
    # path('home/your_playlists/', views.yourPlaylistsPage, name="playlists"),
    path('home/playlists/<str:pk>/', views.PlaylistsPageAPI.as_view(), name="detailed playlist"),
]