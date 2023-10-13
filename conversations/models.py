from django.db import models
from django.contrib.auth.models import User
from events.models import Event


class Conversation(models.Model):
    """
    Conversation model, related to User and Event
    """
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name='conversation')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.content}'
