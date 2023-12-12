import re, json

calendar_text = open('calendar.txt', 'r', errors='ignore').read()

def parse_course(text):
    first_line = text.split('\n')[0]
    if '.' not in first_line:
        return None
    code = first_line.split('. ')[0].strip()
    if re.match('[A-Z]{4}[ \-]?[0-9]{4}', code):
        code = code.replace(' ', '').replace('-', '')
    else:
        return None
    name = first_line.split('. ')[1].strip()
    description = ' '.join(text.split('\n')[1:])

    lecture_hours = re.findall('([0-9\.]+) lecture', description)
    lab_hours = re.findall('([0-9\.]+) lab', description)

    lecture_hours = float(lecture_hours[0]) if len(lecture_hours) > 0 else 3
    lab_hours = float(lab_hours[0]) if len(lab_hours) > 0 else 0

    prereqs = re.findall('\(Prerequisites?: ([^.]+)', description)
    if len(prereqs) > 0:
        prereqs = [prereq.strip() for prereq in prereqs[0].split(',')]

    coreqs = re.findall('\(Corequisites?: ([^.]+)', description)
    if len(coreqs) > 0:
        coreqs = [coreq.strip() for coreq in coreqs[0].split(',')]

    antireqs = re.findall('\(Antirequisites?: ([^.]+)', description)
    if len(antireqs) > 0:
        antireqs = [antireq.strip() for antireq in antireqs[0].split(',')]

    return {
        'code': code,
        'name': name,
        'description': description,
        'prerequisites': prereqs,
        'corequisites': coreqs,
        'antirequisites': antireqs,
        'notes': '',
        'lectureHours': lecture_hours,
        'labHours': lab_hours
    }

listing = []

for chunk in calendar_text.split('\n\n'):
    course = parse_course(chunk)
    if course is not None:
        listing += [course]

json.dump(listing, open('courselisting.json', 'w'), indent=4)