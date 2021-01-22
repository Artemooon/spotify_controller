from rest_framework import serializers
from .models import Room,RoomUser


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('can_guest_pause','votes_to_skip','title')

class JoinRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('code','host')


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('can_guest_pause','votes_to_skip','title','code')


class GetRoomUserInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = RoomUser
        fields = ('user_session','name')