import requests
import json
import psycopg2
from datetime import datetime

# Establish a connection to the database
conn = psycopg2.connect('placeholder')


# Create a table to store the articles if it doesn't exist
cur = conn.cursor()
cur.execute('''
CREATE TABLE IF NOT EXISTS article_tab (
    title VARCHAR(255),
    article TEXT,
    date VARCHAR(255),
    url VARCHAR(255),
    provider VARCHAR(255)
)
''')
conn.commit()


# Discord webhook URL
webhook_url = "placeholder"

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
for _ in range(1):
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
        data = fetch_data(article_url)
        title = data['title']
        article = data.get('article', '')
        date_str = data.get('publishedDateTime')
        provider = data['provider']['name']
        providerUrl = data['sourceHref']
        print(article_url)

        # Convert date string to date object
        if date_str:
            date_obj = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%SZ').date()
        else:
            date_obj = None

        # Insert the data into the database
        cur.execute('''
        INSERT INTO article_tab (title, article, date, url, provider)
        VALUES (%s, %s, %s, %s, %s)
        ''', (title, article, date_obj, providerUrl, provider))

        print(f"Inserted article: {title}, {provider}")

    except (json.JSONDecodeError, KeyError) as e:
        send_discord_message(f"Error parsing article JSON or missing data: {e}")

conn.commit()
cur.close()
conn.close()