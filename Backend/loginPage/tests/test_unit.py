from django.test import TestCase, Client

class TestsCookie(TestCase):
    def test_csrf(self):
        client = Client()
        response = client.get('http://127.0.0.1:8000/api/csrf_cookie')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "CSRF cookie set")
    


