from requests_html import HTMLSession
session = HTMLSession()
r = session.get('https://www.winamax.fr/paris-sportifs/sports/1/1/1')
r.html.render(timeout=20)
print(r.html.html)
session.close()
