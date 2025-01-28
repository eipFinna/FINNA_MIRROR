import unittest
from unittest.mock import patch, Mock
import requests
import json
from scrapers.getArticles import send_discord_message, fetch_data  # Importez les fonctions à tester

class TestScript(unittest.TestCase):
    @patch('getArticles.requests.post')
    def test_send_discord_message(self, mock_post):
        """Test de l'envoi d'un message Discord."""
        mock_post.return_value.status_code = 204  # Simule une réponse réussie
        send_discord_message("Test message")
        mock_post.assert_called_once_with(
            "https://discord.com/api/webhooks/1305055687755436032/iEB9LeV03w24kgVHZsb5iwM6OfprhTiKmNTWAeGiiyST-59sgtdBV3CZRHBx7p68_V--",
            json={"content": "Test message @everyone"}
        )
    
    @patch('getArticles.requests.get')
    def test_fetch_data_success(self, mock_get):
        """Test de récupération de données réussie."""
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "sections": [{"cards": [{"url": "test_url"}]}]
        }  # Simule une réponse JSON valide

        result = fetch_data("https://fakeurl.com")
        self.assertIn("sections", result)  # Vérifie la présence de "sections" dans le résultat
        self.assertEqual(result["sections"][0]["cards"][0]["url"], "test_url")  # Vérifie la validité des données

    @patch('getArticles.requests.get')
    def test_fetch_data_http_error(self, mock_get):
        """Test de levée d'une exception en cas d'erreur HTTP."""
        mock_get.side_effect = requests.exceptions.RequestException("HTTP Error")
        with self.assertRaises(requests.exceptions.RequestException):
            fetch_data("https://fakeurl.com")

    @patch('getArticles.requests.get')
    def test_fetch_data_json_error(self, mock_get):
        """Test de levée d'une exception en cas d'erreur JSON."""
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.side_effect = json.JSONDecodeError("Expecting value", "doc", 0)
        with self.assertRaises(json.JSONDecodeError):
            fetch_data("https://fakeurl.com")

if __name__ == "__main__":
    unittest.main()
