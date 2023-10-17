import coursexml, searchxml, fetchdata
import sys

for a in sys.argv[1:]:
    if 'id=' == a[:3]:
        session_id = a[3:]
    if 'search=' == a[:7]:
        search_term = a[7:]

if session_id is None:
    print('supply a session id with the parameter `id=$SESSION_ID`')
    exit()

if search_term is None:
    print('supply a search term with the parameter `search=$SEARCH_TERM`')
    exit()

print(f'searching for "{search_term}"')
fetched_search = fetchdata.fetch_course_search(search_term, session_id)
search_results = searchxml.scrape_search_list(fetched_search)
print(f'{len(search_results)} results found. using result 1, "{search_results[0]["title"]}"')
fetched_course = fetchdata.fetch_course_id(search_results[0]['course_id'], session_id)
course_options = coursexml.scrape_course_options(fetched_course)
print(f'{len(course_options)} options found.')
for i in course_options:
    days = i["times"]["lecture"]["days"]
    hours = i["times"]["lecture"]["hours"]
    instructor = i["instructor"]["lecture"]
    print(f'{" ".join(days)}, {" ".join(hours)}, {instructor}')