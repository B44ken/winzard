import os

calendar_courses = open('gpt_combined.json', 'r').read()
course_names = open('course-names.txt', 'r').read()

for course in course_names.split('\n'):
    if course not in calendar_courses:
        print('Gone: ' + course)
    else:
        print('Found: ' + course)