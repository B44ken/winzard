import bs4, fetchdata, os

id = os.environ.get('SESSION_ID')

fetch = fetchdata.fetch_course_id('004801', '11', id)
soup = bs4.BeautifulSoup(fetch, 'lxml')
file = open('html/COMP1410-soup.html', 'w')
file.write(str(soup))