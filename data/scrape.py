import re, json

def scrape_listing(string):
    title = re.findall(r"[A-Z]{4}[ -]\d{4}", string)[0]
    try:
        lecture_hours = re.findall(r"[\d\.]+ lecture", string)[0].replace(" lecture", "")
    except:
        lecture_hours = 3
    try:
        lab_hours = re.findall(r"[\d\.]+ lab?", string)[0].replace(" lab", "")
    except:
        lab_hours = 0

    try:
        prereq_list = re.findall(r"(?<=Prerequisite: ).*?(?=\.)", string)
        prerequisites = prereq_list[0]
        prerequisites = prerequisites.replace("(", "").replace(")", "").replace(",", "")
        prerequisites = prerequisites.split(" and ")
    except:
        prerequisites = []

    try:
        coreq_list = re.findall(r"(?<=Corequisite: ).*?(?=\.)", string)
        corequisites = coreq_list[0]
        corequisites = corequisites.replace("(", "").replace(")", "").replace(",", "")
        corequisites = corequisites.split(" and ")
    except:
        corequisites = []
    
    return {
        "title": title,
        "lecture_hours": float(lecture_hours),
        "lab_hours": float(lab_hours),
        "prerequisites": prerequisites,
        "corequisites": corequisites
    }


calendar = open("data/calendar-courses.txt", "r", errors='ignore').read()

scraped = []

for course in calendar.split("\n\n"):
    course = course.replace("\n", " ")
    scraped_entry = scrape_listing(course)
    scraped += [scraped_entry]

json.dump(scraped, open("data/courses_scraped.json", "w"), indent=4)