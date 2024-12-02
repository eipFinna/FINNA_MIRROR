import requests
import json
import html2text

# Discord webhook URL
webhook_url = "https://discord.com/api/webhooks/1305055687755436032/iEB9LeV03w24kgVHZsb5iwM6OfprhTiKmNTWAeGiiyST-59sgtdBV3CZRHBx7p68_V--"

def send_discord_message(message):
    """Send an error message to a Discord channel using a webhook."""
    payload = {
        "content": message + " @everyone"
    }
    try:
        requests.post(webhook_url, json=payload)
    except requests.exceptions.RequestException as e:
        print("Failed to send message to Discord:", e)

def fetch_data(url):
    """Fetch JSON data from the given URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        send_discord_message(f"Error fetching data: {e}")
        raise e
    except json.JSONDecodeError as e:
        send_discord_message(f"Error decoding JSON: {e}")
        raise e

url = "https://assets.msn.com/service/news/feed/pages/channelfeed?apikey=0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM&cm=fr-fr&it=web&memory=8&ocid=social-peregrine&scn=ANON&timeOut=2000&user=m-3D0848EB4F8D67FD322A5DF54EA566BB"

urls = []
for _ in range(5):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        send_discord_message(f"Error fetching channel feed: {e}")
        break

    try:
        data = response.json()
    except json.JSONDecodeError as e:
        send_discord_message(f"Error decoding JSON: {e}")
        break

    for section in data.get('sections', []):
        for card in section.get('cards', []):
            if 'url' in card:
                urls.append(card['url'])

    if 'nextPageUrl' in data:
        url = data['nextPageUrl']
    else:
        break

for url in urls:
    last_part = url.split('/')[-1][3:]
    article_url = f"https://assets.msn.com/content/view/v2/Detail/fr-fr/{last_part}"

    try:
        response = requests.get(article_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        send_discord_message(f"Error fetching article: {e}")
        continue

    try:
        data = response.json()
        print(data['title'] + ", " + data['provider']['name'])
    except (json.JSONDecodeError, KeyError) as e:
        send_discord_message(f"Error parsing article JSON or missing data: {e}")