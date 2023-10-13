from pythonista_api.permissions import IsOwnerOrReadOnly
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ProfileSerializer
from django.db.models import Count
from .models import Profile


class ProfileList(generics.ListAPIView):
    """
    List all profiles.
    """
    queryset = Profile.objects.annotate(
        posts_count=Count('owner__post', distinct=True),
        events_count=Count('owner__event', distinct=True),
        followers_count=Count('owner__followed', distinct=True),
        following_count=Count('owner__following', distinct=True)
    ).order_by('-created_at')
    serializer_class = ProfileSerializer

    filter_backends = [
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    # for DjangoFilterBackend
    filterset_fields = [
        'owner__following__followed__profile',
        'owner__followed__owner__profile',
    ]
    # for OrderingFilter
    ordering_fields = [
        'posts_count',
        'events_count',
        'followers_count',
        'following_count',
        'owner__following__created_at',
        'owner__followed__created_at',
    ]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a profile if the user is the owner.
    """
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.annotate(
        posts_count=Count('owner__post', distinct=True),
        events_count=Count('owner__event', distinct=True),
        followers_count=Count('owner__followed', distinct=True),
        following_count=Count('owner__following', distinct=True)
    ).order_by('-created_at')
    serializer_class = ProfileSerializer
