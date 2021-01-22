from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.urls')),
    path('spotify-api/',include('spotify_api.urls')),
    path('', include('frontend.urls')),
]
