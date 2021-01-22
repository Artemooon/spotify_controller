from django.shortcuts import render,redirect
from musicHub.settings import CLIENT_ID,CLIENT_SECRET,REDIRECT_URI
from rest_framework.views import APIView
from requests import Request,post
from rest_framework.response import Response
from .models import TokenSpotify,Vote
from .spotify import execute_spotify_api_request,skip_song,pause_song,play_song,create_or_update_user_tokens,is_spotify_user_authenticated,prev_song
from backend.models import Room,Host
from .serializers import HostSerializer

class AuthURL(APIView):

    def get(self,request):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET','https://accounts.spotify.com/authorize', params={
            'scope':scopes,
            'response_type':'code',
            'redirect_uri':REDIRECT_URI,
            'client_id':CLIENT_ID
        }).prepare().url

        return Response({'url':url}, status = 200)



def spotify_callback(request):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data = {
            'client_id':CLIENT_ID,
            'client_secret':CLIENT_SECRET,
            'grant_type':"authorization_code",
            'code':code,
            'redirect_uri':REDIRECT_URI,
        }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    create_or_update_user_tokens(request.session.session_key,access_token,token_type,expires_in,refresh_token)

    return redirect('frontend:home')

class CheckUserAuthentication(APIView):

    def get(self,request):

        is_authenticated = is_spotify_user_authenticated(self.request.session.session_key)

        return Response({'is_authenticated':is_authenticated}, status=200)        

class PauseCurrentSong(APIView):

    def put(self,request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code)[0]
        if self.request.session.session_key == room.host or room.can_guest_pause:
            pause_song(room.host)
            return Response({}, status = 204)

        return Response({'Message': 'You dont have permissions'}, status = 403)


class PlayCurrentSong(APIView):

    def put(self,request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code)[0]
        if self.request.session.session_key == room.host or room.can_guest_pause:
            play_song(room.host)
            return Response({}, status = 204)

        return Response({'Message': 'You dont have permissions'}, status = 403)        


class SongVolume(APIView):

    def put(self,request,vol):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code)[0]
        if self.request.session.session_key == room.host or room.can_guest_pause:
            execute_spotify_api_request(room.host,"player/volume?volume_percent=" + str(vol),False,True)
            return Response({}, status = 204)

        return Response({'Message': 'You dont have permissions'}, status = 403)    


class SkipSong(APIView):

    def post(self,request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code).first()
        votes = Vote.objects.filter(room = room,song_id = room.current_song)

        if self.request.session.session_key == room.host or votes.count() + 1 >= room.votes_to_skip:
            votes.delete()
            skip_song(room.host)

        else:
            Vote.objects.create(user = self.request.session.session_key, room = room, song_id = room.current_song) 

        return Response({}, status = 204)    

class PrevSong(APIView):

    def post(self,request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code).first()

        if self.request.session.session_key == room.host or room.can_guest_pause:
            prev_song(room.host)
               

        return Response({}, status = 204)


class SetTrackPosition(APIView):

    def put(self,request,position):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code).first()

        if self.request.session.session_key == room.host:
            execute_spotify_api_request(room.host,'player/seek?position_ms=' + str(position),False,True)
            return Response({}, status = 204)

        return Response({'Message': 'You dont have permissions'}, status = 403)


class CurrentSongInfo(APIView):


    def get(self,request):

        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code)

        if room.exists():
            room = room[0]
        else:
            return Response({'Bad Request': 'Code paramater not found in request'}, status = 404)
        host = room.host
        endpoint = 'player'
        response = execute_spotify_api_request(host,endpoint)

        if 'error' in response or 'item' not in response:
            return Response({'Error':'Request Error'}, status=204)

        item = response.get('item')
        duration = item.get('duration_ms')
        song_progress = response.get('progress_ms')
        song_img = item.get('album').get('images')[1].get('url')
        is_playing = response.get('is_playing')
        track_url = item.get('external_urls').get('spotify')
        song_volume = response.get('device').get('volume_percent')

        artists = ""
        artist_url = ""

        for i,artist in enumerate(item.get('artists')):
            if i > 0:
                artists += ','
                artist_url += ','
            artists += artist.get('name')
            artist_url += item.get('artists')[i].get('external_urls').get('spotify')

        current_votes_count = Vote.objects.filter(room = room, song_id = room.current_song).count()
        song = {
            'id':item.get('id'),
            'title': item.get('name'),
            'track_url':track_url,
            'artists':artists,
            'artist_url':artist_url,
            'duration':duration,
            'play_time':song_progress,
            'image_url':song_img,
            'is_playing':is_playing,
            'votes':current_votes_count,
            'volume':song_volume,
        }

        song_id = item.get('id')

        self.update_room_song(room,song_id)

        return Response(song, status=200)

    def update_room_song(self,room,song_id):

        if room.current_song != song_id:
            room.current_song = song_id
            room.save(update_fields = ['current_song'])
            Vote.objects.filter(room=room).delete()



class GetSpotifyUserInfo(APIView):

    serializer_class = HostSerializer

    def get(self,request):

        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code = room_code)

        if room.exists():
            room = room[0]
        else:
            return Response({'Bad Request': 'Code paramater not found in request'}, status = 404)
        host = room.host
        endpoint = 'https://api.spotify.com/v1/me'
        response = execute_spotify_api_request(host,'')

        if 'error' in response:
            return Response({'Error':'Bad Response'}, status=204)

        user_img = ""
        username = response.get('display_name')
        country = response.get('country')
        user_url  = response.get('external_urls').get('spotify')
        if not not response.get('images'):
            user_img = response.get('images')[0].get('url')

        host_info = Host.objects.filter(host_key=host)
        if not host_info.exists():
            host_info = Host.objects.create(host_key=host, host_name=username, host_url=user_url)

        user = HostSerializer(host_info[0]).data

        return Response(user, status=200)

