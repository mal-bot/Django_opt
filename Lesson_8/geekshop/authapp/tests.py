from django.test import TestCase, Client
from authapp.models import ShopUser


class TestUserTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = ShopUser.objects.create_superuser(
            'django',
            'django@gb.local',
            'geekbrains'
        )

    def test_user_login(self):
        response = self.client.get('/')

        self.assertEqual(response.status_code, 200)

        self.assertTrue(response.context['user'].is_anonymous)

        self.assertNotContains(response, 'Пользователь', status_code=200)

        self.client.login(username='django', password='geekbrains')

        response = self.client.get('/auth/login/')

        self.assertFalse(response.context['user'].is_anonymous)
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Пользователь', status_code=200)
