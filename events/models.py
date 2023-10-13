from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date


class Event(models.Model):
    """
    Event model, related to User
    Default image set so that we can always reference image.url.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.TextField(blank=True)
    event_date = models.DateField(default=date.today)
    organizer = models.CharField(max_length=255, blank=True)
    starts_at = models.TimeField(default=timezone.now)
    ends_at = models.TimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(
        upload_to='images/', default='../default-event_lu9ey8', blank=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.id} {self.title}'
