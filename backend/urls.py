from django.urls import path
from .views import RoomView,CreateRoomView,GetRoom,JoinRoom,UserRoomSession,LeaveRoom,UpdateRoom,GetRoomUserInfo


urlpatterns = [
    path('', RoomView.as_view()),
    path('create-room',CreateRoomView.as_view()),
    path('room/<slug:code>',GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-room-session', UserRoomSession.as_view()),
    path('leave-room',LeaveRoom.as_view()),
    path('update-room',UpdateRoom.as_view()),
    path('user-info',GetRoomUserInfo.as_view()),
]
