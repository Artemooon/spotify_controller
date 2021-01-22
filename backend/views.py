from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .serializers import RoomSerializer,CreateRoomSerializer,JoinRoomSerializer,UpdateRoomSerializer,GetRoomUserInfoSerializer
from .models import Room,RoomUser
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GetRoomUserInfo(APIView):
    serializer_class = GetRoomUserInfoSerializer

    def get(self,request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code)

        if room.exists():
            room = room[0]
            user = RoomUser.objects.filter(room=room, user_session = self.request.session.session_key) 
            data = GetRoomUserInfoSerializer(user).data 
            return Response(data, status=200)

        return Response({'Bad Request': 'Code paramater not found in request'}, status = 404)    

class GetRoom(APIView):
    serializer_class = RoomSerializer
    url_slug = 'code'

    def get(self,request,code, format = None):
        if code:
            room = Room.objects.filter(code = code)
            if room.exists():
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=200)
            return Response({'Bad Request': 'Code paramater not found in request'}, status = 404)      

        return Response({'Bad Request': 'Invalid request'}, status = 400)  


class JoinRoom(APIView):
    serializer_class = JoinRoomSerializer
    url_slug = 'code'

    def post(self,request,format = None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.url_slug)
        if code:
            room_query = Room.objects.filter(code = code)
            if room_query.exists():
                room = room_query[0]
                self.request.session['room_code'] = code
                RoomUser.objects.create(user_session = self.request.session.session_key, room = room)
                return Response({'message': 'Joined successfully'}, status=200)

            return Response({'Bad Request': 'Code not found'}, status=400)   

        return Response({'Bad Request': 'Invalid post code'}, status=404)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer
    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            can_guest_pause = serializer.data.get('can_guest_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            title = serializer.data.get('title')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                print(room.code)
                room.can_guest_pause = can_guest_pause
                room.votes_to_skip = votes_to_skip
                if title == "":
                    room.title = "room №" + str(room.id)
                else:
                    room.title = title
                room.save(update_fields=['can_guest_pause', 'votes_to_skip','title'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data,)
            else:
                room = Room.objects.create(host=host,can_guest_pause = can_guest_pause, votes_to_skip = votes_to_skip,title = title)
                self.request.session['room_code'] = room.code  

                return Response(RoomSerializer(room).data,)
                

class UserRoomSession(APIView):

    def get(self,request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }

        return JsonResponse(data, status = 200)

class LeaveRoom(APIView):

    def post(self,request):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host = request.session.session_key
            room = Room.objects.filter(host=host)
            RoomUser.objects.filter(user_session = host).delete()
            if room.exists():
                room.delete()
        
        return Response({'Message':'Successfully left'}, status=200)



class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self,request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            can_guest_pause = serializer.data.get('can_guest_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            title = serializer.data.get('title')
            code = serializer.data.get('code')
            queryset = Room.objects.filter(code=code)
            if queryset.exists():
                room = queryset[0]
                user_key = self.request.session.session_key
                if user_key == room.host:
                    room.can_guest_pause = can_guest_pause
                    room.votes_to_skip = votes_to_skip
                    room.title = title
                    if title:
                        room.title = title
                    else:
                        room.title = "room №" + str(room.id)
                    room.save(update_fields=['can_guest_pause', 'votes_to_skip','title'])
                    return Response(RoomSerializer(room).data, status=200)
                else:
                    return Response({'Message':'You are not host of this room'}, status=400)    

            else:
                return Response({'Message':'Room not foubd'}, status=404)  



        return Response({'Bad Request':'Invalid data'}, status=400)    


