from django.db import models
from django.utils.crypto import get_random_string


def generate_unique_code():
    return get_random_string(length=12).lower()

class Room(models.Model):
    title = models.CharField(max_length=200,blank = True)
    code = models.CharField(max_length=12,default=generate_unique_code,unique=True)
    host = models.CharField(max_length=70,unique=True)
    can_guest_pause = models.BooleanField(default=False)
    votes_to_skip = models.SmallIntegerField(default=1)
    creation_date = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50,null = True)

def save(self,*args,**kwargs):
        self.title = "room№" + str(self.id)
        super(Room, self).save(*args, **kwargs)
        self.title = "room№" + str(self.id)


def __str__(self):
    return self.title

class Host(models.Model):
    host_key = models.CharField(max_length=70,unique=True)
    host_name = models.CharField(max_length=40)
    host_url = models.CharField(max_length=120)

class RoomUser(models.Model):
    name = models.CharField(max_length=30,blank = True)
    user_session = models.CharField(max_length=70,unique=True)
    room = models.ForeignKey(Room, on_delete = models.CASCADE, null = True)        