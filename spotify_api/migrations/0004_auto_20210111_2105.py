# Generated by Django 3.1.4 on 2021-01-11 19:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_room_current_song'),
        ('spotify_api', '0003_vote'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.room'),
        ),
    ]
