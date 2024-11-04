import requests
import json
import html2text

url = "https://assets.msn.com/service/news/feed/pages/channelfeed?apikey=0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM&cm=fr-fr&it=web&memory=8&ocid=social-peregrine&scn=ANON&timeOut=2000&user=m-3D0848EB4F8D67FD322A5DF54EA566BB"

urls = []
for _ in range(5):
    response = requests.get(url)
    if response.status_code != 200:
        break
    data = response.json()
    for section in data['sections']:
        for card in section['cards']:
            if 'url' in card:
                urls.append(card['url'])
                #print(card['title'])

    if 'nextPageUrl' in data:
        url = data['nextPageUrl']
    else:
        break

for url in urls:
    last_part = url.split('/')[-1][3:]
    Article_Url = "https://assets.msn.com/content/view/v2/Detail/fr-fr/" + last_part
    response = requests.get(Article_Url)
    if response.status_code != 200:
        continue
    data = response.json()

    print(data['title'] + ", " + data['provider']['name'])
    #print (html2text.html2text(data['body']))