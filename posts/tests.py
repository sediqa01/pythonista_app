from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Post


class PostListViewTests(APITestCase):
    """
    Posts Detail view Test
    """
    def setUp(self):
        User.objects.create_user(username='developer', password='django.rf')

    def test_can_list_posts(self):
        developer = User.objects.get(username='developer')
        Post.objects.create(owner=developer, content='new post')
        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_create_post(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.post(
            '/posts/', {'content': 'pythonista post content'})
        count = Post.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_out_user_can_not_create_post(self):
        response = self.client.post(
            '/posts/', {'content': 'pythonista post content'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PostDetailViewTests(APITestCase):
    """
    Post detail view tests
    """
    def setUp(self):
        pythonista = User.objects.create_user(
            username='pythonista', password='pp5.react')
        developer = User.objects.create_user(
            username='developer', password='django.rf')
        Post.objects.create(
            owner=pythonista, content='first post'
        )
        Post.objects.create(
            owner=developer, content='second post'
        )

    def test_user_can_update_own_post(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.put(
            '/posts/2/', {'content': 'Updated post'})
        post = Post.objects.filter(pk=2).first()
        self.assertEqual(post.content, 'Updated post')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_not_update_other_user_post(self):
        self.client.login(username='pythonista', password='pp5.react')
        response = self.client.put(
            '/posts/2/', {'content': 'a new post'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_delete_their_own_post(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.delete('/posts/2/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cant_delete_someone_elses_post(self):
        self.client.login(username='developer', password='django.rf')
        response = self.client.delete('/posts/1/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
