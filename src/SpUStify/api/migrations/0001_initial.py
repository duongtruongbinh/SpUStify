# Generated by Django 4.1 on 2023-07-01 09:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Artist Name')),
            ],
        ),
        migrations.CreateModel(
            name='PlayedPlaylist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='PlayedSong',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Song Name')),
                ('likes', models.PositiveIntegerField(default=0, verbose_name='Number Of Likes')),
                ('listens', models.PositiveIntegerField(default=0, verbose_name='Number Of Listens')),
                ('file', models.FileField(default='', upload_to='audio/')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Songs of account')),
            ],
        ),
        migrations.CreateModel(
            name='UserPlayedSong',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked', models.BooleanField()),
                ('listens', models.PositiveIntegerField(default=0)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('played_song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.playedsong')),
            ],
        ),
        migrations.CreateModel(
            name='UserPlayedPlaylist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked', models.BooleanField()),
                ('listens', models.PositiveIntegerField(default=0)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('played_playlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.playedplaylist')),
            ],
        ),
        migrations.CreateModel(
            name='SongArtist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_main_artist', models.BooleanField()),
                ('artist', models.ManyToManyField(to='api.artist')),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.song')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=50, verbose_name='Full Name')),
                ('dob', models.DateField(verbose_name='Date Of Birth')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('phone', models.CharField(max_length=10, verbose_name='Phone Number (+84)')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Playlist Name')),
                ('status', models.CharField(choices=[('pvt', 'Private'), ('pub', 'Public')], max_length=3)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Playlists of account')),
                ('songs', models.ManyToManyField(to='api.song', verbose_name='List of songs')),
            ],
        ),
        migrations.AddField(
            model_name='playedsong',
            name='accounts',
            field=models.ManyToManyField(through='api.UserPlayedSong', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='playedsong',
            name='song',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.song'),
        ),
        migrations.AddField(
            model_name='playedplaylist',
            name='accounts',
            field=models.ManyToManyField(through='api.UserPlayedPlaylist', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='playedplaylist',
            name='playlist',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.playlist'),
        ),
    ]