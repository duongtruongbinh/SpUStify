# Generated by Django 4.1 on 2023-08-07 11:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_profile_is_artist'),
    ]

    operations = [
        migrations.RenameField(
            model_name='artist',
            old_name='name',
            new_name='artist_name',
        ),
        migrations.RemoveField(
            model_name='artist',
            name='avatar',
        ),
        migrations.RemoveField(
            model_name='artist',
            name='background_image',
        ),
        migrations.AddField(
            model_name='artist',
            name='profile',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='profile', to='api.profile'),
        ),
    ]
