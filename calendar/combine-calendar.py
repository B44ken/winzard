import json, os

all_courses = []

for school in os.listdir('school'):
    if school == 'all.json':
        continue
    all_courses += json.load(open('school/' + school + '/calendar.json', 'r'))

open('school/all.json', 'w').write(json.dumps(all_courses, indent=4))