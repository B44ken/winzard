import coursexml, searchxml, fetchdata
import os, json

CALENDAR='fall2024'

session_id = os.environ.get('SESSION_ID')

if session_id is None:
    print('supply a session id with the parameter `id=$SESSION_ID`')
    exit()
    raise Exception('no session id supplied')

courses_list = open('data/ids/comp.txt').read().split('\n')

try:
    for centry in courses_list:
        course_code, course_id, dbcsprd  = centry.split(',')
        print(f'\nfetching {course_code}')
        fetched_course = fetchdata.fetch_course_id(course_id, dbcsprd, session_id)

        dump = open(f'html/{course_code}.html', 'w+')
        dump.write(fetched_course)
        dump.close()

        course_options = coursexml.scrape_course_options(fetched_course)
        if len(course_options) == 0:
            print(f'no options found for {course_code} {course_id}')
            continue
        print(f'{len(course_options)} options found for {course_code} {course_id}')
        print(json.dumps(course_options), 
            file = open(f'data/courses/{CALENDAR}/{course_code}.json', 'w'))
except KeyboardInterrupt:
    exit()