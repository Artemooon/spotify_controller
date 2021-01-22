from rest_framework import serializers
from backend.models import Host


class HostSerializer(serializers.ModelSerializer):
    class Meta:
        host_key = serializers.CharField(validators=[])

        model = Host
        fields = ('host_name','host_key','host_url')
