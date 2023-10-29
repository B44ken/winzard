# graduate courses aren't supported at the moment
INCLUDE_GRADUATE_COURSES = False

# skip courses that have already been downloaded
SKIP_EXISTING = True


import coursexml, searchxml, fetchdata
import os, sys, json

def download_course(i):
    is_graduate = int(i['title'][4]) > 4
    if not INCLUDE_GRADUATE_COURSES and is_graduate:
        # print(f'skipping {i["title"]} (graduate course)')
        return False

    if SKIP_EXISTING and i['title'].replace(' ', '') in existing_courses:
        return False

    print(f'using {i["title"]}: ', end='')
    fetched_course = fetchdata.fetch_course_id(i['course_id'], i['dbcsprd'], session_id)
    course_options = coursexml.scrape_course_options(fetched_course, i['title'])

    print(f'{len(course_options)} options found')

    dump = json.dumps(course_options, indent=4)
    open(f'data/courses/winter2024/{i["title"].replace(" ","")}.json', 'w+').write(dump)

existing_courses = [i.split('.')[0] for i in os.listdir('data/courses/winter2024')]

session_id = os.environ.get('SESSION_ID')
if session_id is None:
    print('supply a session id by exporting `SESSION_ID`')
    exit()

try:
    search_term = sys.argv[1]
except IndexError:
    print('supply a search term')
    exit()

print(f'searching for "{search_term}"')
fetched_search = fetchdata.fetch_course_search(search_term, session_id)

search_results = searchxml.scrape_search_list(fetched_search)
print(f'{len(search_results)} results found.')

for i in search_results:
    download_course(i)