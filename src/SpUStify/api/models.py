from django.db import models
from django.contrib.auth.models import User
from django.db.models import Count, Sum

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=50, verbose_name='Full Name')
    dob = models.DateField(verbose_name='Date Of Birth')
    email = models.EmailField(max_length=254, verbose_name='Email')
    phone = models.CharField(max_length=10, verbose_name='Phone Number (+84)')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    background_image = models.ImageField(upload_to='backgrounds/', null=True, blank=True)
    
    def __str__(self) -> str:
        return self.full_name


class Artist(models.Model):
    name = models.CharField(max_length=50, verbose_name='Artist Name')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    background_image = models.ImageField(upload_to='backgrounds/', null=True, blank=True)
    
    def __str__(self) -> str:
        return self.name


class Song(models.Model):
    name = models.CharField(max_length=50, verbose_name='Song Name')
    likes = models.PositiveIntegerField(default=0, verbose_name='Number Of Likes')
    listens = models.PositiveIntegerField(default=0, verbose_name='Number Of Listens')
    song_file = models.FileField(upload_to='audio/', default='')
    lyric_file = models.FileField(upload_to='lyric/', default='')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    background_image = models.ImageField(upload_to='backgrounds/', null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    account = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Songs of account")

    def save(self, *args, **kwargs):
        self.likes = UserPlayedSong.objects.filter(played_song__song=self).filter(liked=True).count()
        self.listens = UserPlayedSong.objects.filter(played_song__song=self).aggregate(total_listens=Sum('listens'))['total_listens'] or 0
        super(Song, self).save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Playlist(models.Model):
    STATUS_CHOICES = (
        ('pvt', 'Private'),
        ('pub', 'Public'),
    )

    name = models.CharField(max_length=50, verbose_name='Playlist Name')
    status = models.CharField(max_length=3, choices=STATUS_CHOICES)
    created_date = models.DateTimeField(auto_now_add=True)
    songs = models.ManyToManyField(Song, verbose_name="List of songs")
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    background_image = models.ImageField(upload_to='backgrounds/', null=True, blank=True)
    account = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Playlists of account")

    def __str__(self) -> str:
        return self.name


class MainArtist(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'{self.song.name} - {self.artist}'

class CollabArtist(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    artist = models.ManyToManyField(Artist)
    
    def __str__(self) -> str:
        return f'{self.song.name} - {", ".join(str(artist) for artist in self.artist.all())}'

class PlayedSong(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    accounts = models.ManyToManyField(User, through='UserPlayedSong')

    def __str__(self) -> str:
        return f'{self.song.name} - Played by {", ".join(str(account) for account in self.accounts.all())}'


class UserPlayedSong(models.Model):
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    played_song = models.ForeignKey(PlayedSong, on_delete=models.CASCADE)
    liked = models.BooleanField()
    listens = models.PositiveIntegerField(default=0)


class PlayedPlaylist(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    accounts = models.ManyToManyField(User, through='UserPlayedPlaylist')

    def __str__(self) -> str:
        return f'{self.playlist.name} - Played by {", ".join(str(account) for account in self.accounts.all())}'


class UserPlayedPlaylist(models.Model):
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    played_playlist = models.ForeignKey(PlayedPlaylist, on_delete=models.CASCADE)
    liked = models.BooleanField()
    listens = models.PositiveIntegerField(default=0)
