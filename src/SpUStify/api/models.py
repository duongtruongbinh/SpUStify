from django.db import models
from django.contrib.auth.models import User
from django.db.models import Count, Sum


class Profile(models.Model):
    account = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=50, verbose_name='Full Name')
    dob = models.DateField(verbose_name='Date Of Birth')
    email = models.EmailField(max_length=254, verbose_name='Email')
    phone = models.CharField(max_length=10, verbose_name='Phone Number (+84)')
    avatar = models.ImageField(upload_to='avatars', null=True, blank=True)
    background_image = models.ImageField(upload_to='backgrounds', null=True, blank=True)
    
    def __str__(self) -> str:
        return self.full_name

class Artist(models.Model):
    artist_name = models.CharField(max_length=50, verbose_name='Artist Name')
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='profile')
    def __str__(self) -> str:
        return self.artist_name


class Song(models.Model):
    name = models.CharField(max_length=50, verbose_name='Song Name', unique = True)
    likes = models.PositiveIntegerField(default=0, verbose_name='Number Of Likes')
    listens = models.PositiveIntegerField(default=0, verbose_name='Number Of Listens')
    song_file = models.FileField(upload_to='audios', null=True, blank=True)
    lyric_file = models.FileField(upload_to='lyrics', null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars', null=True, blank=True)
    background_image = models.ImageField(upload_to='backgrounds', null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    main_artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    
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

    name = models.CharField(max_length=50, verbose_name='Playlist Name', unique = True)
    status = models.CharField(max_length=3, choices=STATUS_CHOICES)
    created_date = models.DateTimeField(auto_now_add=True)
    songs = models.ManyToManyField(Song, verbose_name="List of songs")
    avatar = models.ImageField(upload_to='avatars', null=True, blank=True)
    background_image = models.ImageField(upload_to='backgrounds', null=True, blank=True)
    account = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Playlists of account")

    def __str__(self) -> str:
        return self.name

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
