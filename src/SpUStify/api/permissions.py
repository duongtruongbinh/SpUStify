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