from django.urls import path
from . import views

app_name = "frontend"

urlpatterns = [
    path('', views.index, name = "home"),
    path('join-room', views.index),
    path('create-room', views.index),
    path('room/<slug:code>', views.index)
]
