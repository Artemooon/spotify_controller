from .models import TokenSpotify
from django.utils import timezone
from datetime import timedelta
from musicHub.settings import CLIENT_ID,CLIENT_SECRET
from requests import post,put,get

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_key):
    tokens = TokenSpotify.objects.filter(user = session_key)
    if tokens.exists():
        return tokens.first()
    else:
        return None

def create_or_update_user_tokens(session_key,access_token,token_type,expires_in,refresh_token):
    tokens = get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.refresh_token = refresh_token
        tokens.save(update_fields=['access_token', 'token_type','expires_in','refresh_token'])

    else:
        tokens = TokenSpotify(user=session_key, access_token=access_token,
        refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()   


def is_spotify_user_authenticated(session_key):
    tokens = get_user_tokens(session_key)
    if tokens:
        expire = tokens.expires_in
        if expire <= timezone.now():
            refresh_spotify_token(session_key)
        return True    

    return False        


def refresh_spotify_token(session_key):
    tokens = get_user_tokens(session_key)
    refresh_token = tokens.refresh_token

    response = post('https://accounts.spotify.com/api/token', data = {
        'grant_type':'refresh_token',
        'refresh_token':refresh_token,
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET,
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    create_or_update_user_tokens(session_key,access_token,token_type,expires_in,refresh_token)

def execute_spotify_api_request(session_key,endpoint, _post = False, _put = False):

    tokens = get_user_tokens(session_key)

    headers = {
        'Content-Type':'application/json',"Accept": "application/json" ,'Authorization' : "Bearer " + tokens.access_token
    }    


    if _post:
       post(BASE_URL + endpoint, headers = headers)
    if _put:
       put(BASE_URL + endpoint, headers = headers)     

    response = get(BASE_URL + endpoint, {} , headers = headers)    

    try:
        return response.json()
    except:
        return {'Error': 'Request error'}    


def play_song(session_key):

    return execute_spotify_api_request(session_key, "player/play", False,True)

def pause_song(session_key):

    return execute_spotify_api_request(session_key, "player/pause",False,True)    

def skip_song(session_key):

    return execute_spotify_api_request(session_key, "player/next",True,False)

def prev_song(session_key):

    return execute_spotify_api_request(session_key, "player/previous",True,False)

