from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from .models import Profile


class ProfileListViewTests(APITestCase):
    """
    Profile model list view tests
    """
    def setUp(self):
        User.objects.create_user(username='pythonista', password='pp5.react')
        User.objects.create_user(username='developer', password='django.rf')

    def test_can_list_profiles(self):
        response = self.client.get('/profiles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_profile_created_on_user_creation(self):
        self.client.get('/profiles/')
        count = Profile.objects.count()
        self.assertEqual(count, 2)


class ProfileDetailViewTests(APITestCase):
    """
    Profile model detail view Tests
    """
    def setUp(self):
        User.objects.create_user(username='pythonista', password='pp5.react')
        User.objects.create_user(username='developer', password='django.rf')

    def test_can_not_retrieve_profile_using_invalid_id(self):
        response = self.client.get('/profiles/55/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_can_retrieve_profile_using_valid_id(self):
        response = self.client.get('/profiles/2/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_update_own_profile(self):
        self.client.login(username='pythonista', password='pp5.react')
        response = self.client.put(
            '/profiles/1/', {'full_name': 'A Pythonista '}
        )
        profile = Profile.objects.filter(pk=1).first()
        self.assertEqual(profile.full_name, 'A Pythonista')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_update_someone_elses_profile(self):
        self.client.login(username='pythonista', password='pp5.react')
        response = self.client.put(
            '/profiles/2/', {'bio': 'A python lover!'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
