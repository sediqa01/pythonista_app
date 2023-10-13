from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Post
from .models import Comment


class CommentListViewTests(APITestCase):
    """
    Comment List view Test
    """
    def setUp(self):
        pythonista = User.objects.create_user(
            username='pythonista', password='pp5.react')
        Post.objects.create(owner=pythonista, content='Good luck!')

    def test_can_list_comment(self):
        pythonista = User.objects.get(username='pythonista')
        post_first = Post.objects.get(id=1)
        Comment.objects.create(
            owner=pythonista, post=post_first, content='New comment'
        )
        response = self.client.get('/comments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_add_comment(self):
        self.client.login(username='pythonista', password='pp5.react')
        Post.objects.get(id=1)
        current_user = User.objects.get(username='pythonista')
        response = self.client.post(
            '/comments/', {
                'owner': current_user, 'post': 1, 'content': 'a new comment'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_out_user_can_not_create_comment(self):
        post_first = Post.objects.get(id=1)
        response = self.client.post(
            '/comments/', {
                'post': post_first, 'content': 'a new comment'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        count = Comment.objects.count()
        self.assertEqual(count, 0)


class CommentDetailViewTests(APITestCase):
    """
     Comment Detail view Test
    """
    def setUp(self):
        pythonista = User.objects.create_user(
            username='pythonista', password='pp5.react')
        developer = User.objects.create_user(
            username='developer', password='django.rf')
        post_first = Post.objects.create(
            owner=pythonista, content='Pythonista Networking evening')
        post_second = Post.objects.create(
            owner=developer, content='Weekend Meetup')
        Comment.objects.create(
            owner=pythonista, post=post_first, content='love it!!'
        )
        Comment.objects.create(
            owner=developer, post=post_second, content='Good one'
        )

    def test_logged_in_user_can_update_their_own_comment(self):
        self.client.login(username='pythonista', password='pp5.react')
        response = self.client.put(
            '/comments/1/', {'content': 'Informative'}
        )
        comment = Comment.objects.filter(pk=1).first()
        self.assertEqual(comment.content, 'Informative')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_not_update_others_comment(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.put(
            '/comments/1/', {'content': 'updated content'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_delete_their_own_comment(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.delete('/comments/2/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cant_delete_someone_elses_comment(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.delete('/comments/1/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
