import coursexml, searchxml, fetchdata
import os, time

session_id = os.environ.get('SESSION_ID')

queries = ['math']

for q in queries:
    searchdata = fetchdata.fetch_course_search(f'{q} ', session_id)
    results = searchxml.scrape_search_list(searchdata)
    id = open(f'data/ids/{q}.txt', 'a')
    for r in results:
        print(f'{r["title"].replace(" ", "")},{r["course_id"]},{r["dbcsprd"]}', file=id)