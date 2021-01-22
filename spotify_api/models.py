from django.db import models
from backend.models import Room


class TokenSpotify(models.Model):
    user = models.CharField(max_length = 70, unique=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

    
class Vote(models.Model):
    room = models.ForeignKey(Room,on_delete = models.CASCADE)
    user = models.CharField(max_length = 70, unique=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
