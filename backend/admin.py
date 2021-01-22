from django.contrib import admin
from .models import Room,RoomUser,Host

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("code","host","can_guest_pause","votes_to_skip",)
    save_on_top = True

@admin.register(RoomUser)
class RoomUserAdmin(admin.ModelAdmin):
    list_display = ("user_session","name","room",)
    save_on_top = True    


@admin.register(Host)
class RoomUserAdmin(admin.ModelAdmin):
    list_display = ("host_name","host_url","host_key",)
    save_on_top = True        