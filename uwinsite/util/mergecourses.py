import os, json

all_courses = []

for i in os.listdir('../data/courses/winter2024'):
    courses = open(f'../data/courses/winter2024/{i}').read()
    courses = json.loads(courses)
    for c in range(len(courses)):
        courses[c]['code'] = i[:-5]
    all_courses += courses

dump = open('../data/winter2024.json', 'w+')
dump.write(json.dumps(all_courses, indent=4))