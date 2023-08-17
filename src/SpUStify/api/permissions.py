from rest_framework.permissions import BasePermission

class IsAdminGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Admin').exists()
    
class IsArtistGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Artist').exists()
    
class IsUserGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='User').exists()
    
class IsPlaylistOwner(BasePermission):
    """
    Custom permission to only allow the owner of a playlist to perform actions on it.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the playlist
        return obj.account == request.user