from django.contrib.auth.models import User
from .models import Event
from rest_framework import status
from rest_framework.test import APITestCase


class EventListViewTests(APITestCase):
    """
     Event list view Test
    """
    def setUp(self):
        User.objects.create_user(username='pythonista', password='pp5.react')

    def test_can_list_events(self):
        pythonista = User.objects.get(username='pythonista')
        Event.objects.create(
            owner=pythonista, title='a title', event_date='2023-07-22')
        response = self.client.get('/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_not_logged_in_cant_create_event(self):
        response = self.client.post('/events/', {'title': 'a title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        count = Event.objects.count()
        self.assertEqual(count, 0)

    def test_logged_in_user_can_create_event(self):
        self.client.login(username='pythonista', password='pp5.react')
        response = self.client.post(
            '/events/', {
                'title': 'a title', 'event_date': '2023-07-22',
                'starts_at': '06:00 AM', 'ends_at': '09:00AM'
                  }
        )
        count = Event.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class EventDetailViewTests(APITestCase):
    """
     Event Detail view Test
    """
    def setUp(self):
        pythonista = User.objects.create_user(
            username='pythonista', password='pp5.react')
        developer = User.objects.create_user(
            username='developer', password='django.rf')
        Event.objects.create(
            owner=pythonista,
            title='a title',
            description='networking event',
            event_date='2023-07-23'
        )
        Event.objects.create(
            owner=developer,
            title='new title',
            description='coding event',
            event_date='2023-07-22'
        )

    def test_can_retrieve_event_using_valid_id(self):
        response = self.client.get('/events/1/')
        self.assertEqual(response.data['title'], 'a title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_retrieve_event_using_invalid_id(self):
        response = self.client.get('/events/55/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_own_event(self):
        self.client.login(username='pythonista', password='pp5.react')
        response = self.client.put(
            '/events/1/', {
                'title': 'updated title', 'event_date': '2023-07-22',
                'starts_at': '06:00 AM', 'ends_at': '09:00AM'}
        )
        event = Event.objects.filter(pk=1).first()
        self.assertEqual(event.title, 'updated title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_update_someone_elses_event(self):
        self.client.login(username='pythonista', password='pp5.react')
        response = self.client.put('/events/2/', {'title': 'an edited title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_delete_their_own_event(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.delete('/events/2/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cant_delete_someone_elses_event(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.delete('/events/1/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
