from .models import Join
from .serializers import JoinSerializer
from rest_framework import generics, permissions
from pythonista_api.permissions import IsOwnerOrReadOnly


class JoinList(generics.ListCreateAPIView):
    """
    List Join or create a Join  reply if logged in.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = JoinSerializer
    queryset = Join.objects.all()

    # use generics in-built perform_create method
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class JoinDetail(generics.RetrieveDestroyAPIView):
    """
    Retrieve a Join reply or delete it by id if you own it.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = JoinSerializer
    queryset = Join.objects.all()
