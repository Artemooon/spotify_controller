from django.contrib import admin
from .models import TokenSpotify,Vote

@admin.register(TokenSpotify)
class TokenSpotify(admin.ModelAdmin):
    list_display = ("user","access_token","refresh_token","expires_in","creation_date")
    save_on_top = True


@admin.register(Vote)
class Vote(admin.ModelAdmin):
    list_display = ("user","room","song_id","creation_date")
    save_on_top = True    