from django.db import IntegrityError
from rest_framework import serializers
from .models import Join


class JoinSerializer(serializers.ModelSerializer):
    """
    Join serializer
    """
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Join
        fields = [
            'id', 'owner', 'event', 'created_at'
        ]

    def create(self, validated_data):
        """
        Validation to stop a user to Join the same event twice
        """
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'You are already Joined!'})
