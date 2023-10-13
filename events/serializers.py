from rest_framework import serializers
from .models import Event
from joins.models import Join


class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(
        source='owner.profile.image.url')
    join_id = serializers.SerializerMethodField()
    conversations_count = serializers.ReadOnlyField()
    joins_count = serializers.ReadOnlyField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_join_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            join = Join.objects.filter(
                owner=user, event=obj
            ).first()
            return join.id if join else None
        return None

    class Meta:
        model = Event
        fields = [
            'id', 'owner', 'title', 'description', 'location',
            'starts_at', 'ends_at', 'created_at',
            'updated_at', 'image', 'event_date',
            'is_owner', 'profile_id', 'profile_image',
            'join_id', 'conversations_count', 'joins_count',
            'organizer',
        ]
