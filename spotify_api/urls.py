from django.urls import path
from .views import AuthURL,spotify_callback,CheckUserAuthentication,CurrentSongInfo,PauseCurrentSong,PlayCurrentSong,SkipSong,SongVolume,PrevSong,GetSpotifyUserInfo,SetTrackPosition

urlpatterns = [
    path('authorization-url',AuthURL.as_view()),
    path('authorization-redirect',spotify_callback),
    path('authentication-check',CheckUserAuthentication.as_view()),
    path('current-song-info',CurrentSongInfo.as_view()),
    path('pause-song',PauseCurrentSong.as_view()),
    path('play-song',PlayCurrentSong.as_view()),
    path('skip-song',SkipSong.as_view()),
    path('previous-song',PrevSong.as_view()),
    path('set-volume/<int:vol>',SongVolume.as_view()),
    path('spotify-user',GetSpotifyUserInfo.as_view()),
    path('set-track-position/<int:position>',SetTrackPosition.as_view()),
]