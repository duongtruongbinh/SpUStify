# Generated by Django 4.1 on 2023-08-05 02:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_playlist_name_alter_song_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='main_artist',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.artist'),
        ),
    ]
