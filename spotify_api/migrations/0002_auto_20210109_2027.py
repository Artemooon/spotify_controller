# Generated by Django 3.1.4 on 2021-01-09 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tokenspotify',
            name='access_token',
            field=models.CharField(max_length=150),
        ),
        migrations.AlterField(
            model_name='tokenspotify',
            name='refresh_token',
            field=models.CharField(max_length=150),
        ),
    ]