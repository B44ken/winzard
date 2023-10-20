import bs4, sys, json, re

def scrape_search_list(xml):
    xml = xml.replace('<![CDATA[', '').replace(']]>', '')
    soup = bs4.BeautifulSoup(xml, 'xml')

    anchor = soup.select('a[id^=PTS_LIST_TITLE]')

    results = []

    for a in anchor:
        title = a.text.strip()
        dbcsprd = re.findall(r'DBCSPRD_([0-9]+)', a['href'])[0]
        course_id = re.findall(r'U?GRA?D=([^=]+)=', a['href'])[0]
        results += [{
            'title': title,
            'dbcsprd': dbcsprd,
            'course_id': course_id
        }]

    return results

if __name__ == '__main__':
    file_path = sys.argv[1] if 1 in sys.argv else 'math1730'
    file_text = open(f'html/{file_path}-search.html').read()

    opt = scrape_search_list(file_text)
    print(json.dumps(opt, indent=4))