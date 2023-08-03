from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Profile)
admin.site.register(Song)
admin.site.register(Artist)
admin.site.register(MainArtist)
admin.site.register(CollabArtist)
admin.site.register(Playlist)
admin.site.register(PlayedSong)
admin.site.register(PlayedPlaylist)
admin.site.register(UserPlayedSong)
admin.site.register(UserPlayedPlaylist)