from rest_framework.permissions import BasePermission
from django.contrib.auth.models import User
from .models import Playlist, Song


class IsAdminGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Admin').exists()


class IsArtistGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Artists').exists()


class IsUserGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Users').exists()


class IsSongOwner(BasePermission):
    """
    Custom permission to only allow the owner of a song to perform actions on it.
    """

    def has_permission(self, request, view):
        song_id = view.kwargs.get('song_id')
        if not song_id:
            return True  # No song_id in URL, allow access

        try:
            song = Song.objects.get(pk=song_id)
        except Song.DoesNotExist:
            return True  # Song does not exist, allow access

        return request.user == song.main_artist.profile.account


class IsPlaylistOwner(BasePermission):
    """
    Custom permission to only allow the owner of a playlist to perform actions on it.
    """

    def has_permission(self, request, view):
        playlist_id = view.kwargs.get('playlist_id')
        if not playlist_id:
            return True  # No playlist_id in URL, allow access

        try:
            playlist = Playlist.objects.get(pk=playlist_id)
        except Playlist.DoesNotExist:
            return True  # Playlist does not exist, allow access

        return request.user == playlist.account
