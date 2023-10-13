from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Event
from .models import Join


class JoinListViewTests(APITestCase):
    """
    Join list view Test
    """
    def setUp(self):
        pythonista = User.objects.create_user(
            username='pythonista', password='pp5.react')
        Event.objects.create(
            owner=pythonista, title='Coding Event', event_date='2023-07-23')

    def test_can_list_all_joins(self):
        pythonista = User.objects.get(username='pythonista')
        event_first = Event.objects.get(id=1)
        Join.objects.create(owner=pythonista, event=event_first)
        response = self.client.get('/joins/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_out_user_can_not_create_join(self):
        event_first = Event.objects.get(id=1)
        response = self.client.post('/joins/', {'event': event_first})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        count = Join.objects.count()
        self.assertEqual(count, 0)

    def test_logged_in_user_can_add_join(self):
        self.client.login(username='pythonista', password='pp5.react')
        Event.objects.get(id=1)
        user = User.objects.get(username='pythonista')
        response = self.client.post(
            '/joins/', {'owner': user, 'event': 1}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class JoinDetailViewTests(APITestCase):
    """
    Joins Detail view Test
    """
    def setUp(self):
        pythonista = User.objects.create_user(
            username='pythonista', password='pp5.react')
        developer = User.objects.create_user(
            username='developer', password='django.rf')
        event_first = Event.objects.create(
            owner=pythonista,
            title='Networking evening', event_date='2023-07-23')
        event_second = Event.objects.create(
            owner=developer, title='Weekend Meetup', event_date='2023-07-25')
        Join.objects.create(owner=pythonista, event=event_first)
        Join.objects.create(owner=developer, event=event_second)

    def test_can_not_join_to_the_same_event_twice(self):
        self.client.login(username='pythonista', password='pp5.react')
        user = User.objects.get(username='pythonista')
        Event.objects.get(id=1)
        response = self.client.post(
            '/joins/', {'owner': user, 'event': 1}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logged_in_user_can_delete_own_join(self):
        self.client.login(username='pythonista', password='pp5.react')
        User.objects.get(username='pythonista')
        response = self.client.delete('/joins/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logged_in_user_can_not_delete_others_join(self):
        self.client.login(username='pythonista', password='pp5.react')
        User.objects.get(username='pythonista')
        response = self.client.delete('/joins/2/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
