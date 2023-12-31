from django.test import TestCase, Client
from django.urls import reverse
from urllib.parse import quote
from django.http import HttpResponseBadRequest


class GetMoveSuccessTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_move_success(self):
        fen = r"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        encoded_fen = quote(fen)

        url = reverse("get_move", args=(encoded_fen, 1))
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)


class GetMoveFailureTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_move_failure(self):
        bad_fen = r"a/b/c/d/e/f/g/h w - - 0 1"
        url = reverse("get_move", args=(bad_fen, 1))

        response = self.client.get(url)

        self.assertEqual(response.status_code, HttpResponseBadRequest.status_code)
        self.assertIn("Invalid FEN.", response.content.decode())
