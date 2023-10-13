from rest_framework import generics, permissions
from pythonista_api.permissions import IsOwnerOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CommentSerializer, CommentDetailSerializer
from .models import Comment


class CommentList(generics.ListCreateAPIView):
    """
    List all comments
    Create a new comment if authenticated
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    filter_backends = [
        DjangoFilterBackend
    ]
    filterset_fields = [
        # get comments on each post
        'post',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve a comment, or update or delete it by id if you own it.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = CommentDetailSerializer
    queryset = Comment.objects.all()
