import json, os, re, openai, time

# ls school/*/calendar.json
school_lists = os.walk('school').__next__()[1]
all_courses = []

print(school_lists)

for school in school_lists:
    if school == 'all':
        continue
    print(school)
    all_courses += json.load(open('school/' + school + '/calendar.json', 'r'))

json.dump(all_courses, open('school/all/calendar.json', 'w'))