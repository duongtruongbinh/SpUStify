from rest_framework.permissions import BasePermission
from django.contrib.auth.models import User
from .models import Playlist

class IsAdminGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Admin').exists()
    
class IsArtistGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Artists').exists()
    
class IsUserGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Users').exists()
    
class IsPlaylistOwner(BasePermission):
    """
    Custom permission to only allow the owner of a playlist to perform actions on it.
    """

    def has_permission(self, request, view):
        playlist = Playlist.objects.get(pk=view.kwargs['playlist_id'])
        return request.user == playlist.account