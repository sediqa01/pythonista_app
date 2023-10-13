from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Conversation
from .models import Event


class ConversationListViewTests(APITestCase):
    """
    Conversations List view Test
    """
    def setUp(self):
        pythonista = User.objects.create_user(
            username='pythonista', password='pp5.react')
        Event.objects.create(
            owner=pythonista, title='Coding Event', event_date='2023-07-23')

    def test_can_list_conversations(self):
        pythonista = User.objects.get(username='pythonista')
        event_first = Event.objects.get(id=1)
        Conversation.objects.create(
            owner=pythonista, event=event_first, content='New conversations'
        )
        response = self.client.get('/conversations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_out_user_can_not_create_conversation(self):
        event_first = Event.objects.get(id=1)
        response = self.client.post(
            '/conversations/', {
                'event': event_first, 'content': 'a new content'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        count = Conversation.objects.count()
        self.assertEqual(count, 0)

    def test_logged_in_user_can_add_conversation(self):
        self.client.login(username='pythonista', password='pp5.react')
        Event.objects.get(id=1)
        current_user = User.objects.get(username='pythonista')
        response = self.client.post(
            '/conversations/', {
                'owner': current_user, 'event': 1, 'content': 'a new content'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ConversationDetailViewTests(APITestCase):
    """
     Conversations Detail view Test
    """
    def setUp(self):
        pythonista = User.objects.create_user(
            username='pythonista', password='pp5.react')
        developer = User.objects.create_user(
            username='developer', password='django.rf')
        event_first = Event.objects.create(
            owner=pythonista, title='Pythonista Networking evening ',
            event_date='2023-07-23')
        event_second = Event.objects.create(
            owner=developer, title='Weekend Meetup', event_date='2023-07-25')
        Conversation.objects.create(
            owner=pythonista, event=event_first, content='love to join!!'
        )
        Conversation.objects.create(
            owner=developer, event=event_second, content='I am not ganna join'
        )

    def test_logged_in_user_can_update_their_own_conversation(self):
        self.client.login(username='pythonista', password='pp5.react')
        response = self.client.put(
            '/conversations/1/', {'content': 'Informative'}
        )
        conversation = Conversation.objects.filter(pk=1).first()
        self.assertEqual(conversation.content, 'Informative')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_not_update_others_conversations(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.put(
            '/conversations/1/', {'content': 'updated content'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_delete_their_own_conversation(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.delete('/conversations/2/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cant_delete_someone_elses_conversation(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.delete('/conversations/1/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
