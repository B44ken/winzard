import os, json

all_courses = []

CALENDAR='fall2024'

for i in os.listdir(f'../data/courses/{CALENDAR}'):
    courses = open(f'../data/courses/{CALENDAR}/{i}').read()
    courses = json.loads(courses)
    for c in range(len(courses)):
        courses[c]['code'] = i[:-5]
    all_courses += courses

dump = open(f'../data/{CALENDAR}.json', 'w+')
dump.write(json.dumps(all_courses, indent=4))