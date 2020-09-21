from django.test import TestCase, Client


class TestMainappTestCase(TestCase):
    expected_status_code = 200

    def setUp(self):
        self.client = Client()

    def test_mainapp_urls(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, self.expected_status_code)

        response = self.client.get('/contact/')
        self.assertEqual(response.status_code, self.expected_status_code)



    # def tearDown(self):
    #     pass

