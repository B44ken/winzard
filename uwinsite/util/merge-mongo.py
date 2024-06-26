# todo: merge these two files
# currently we write to a file and then read from it again which is stupid

import pymongo, os, json, sys

MONGO_PASS = os.environ.get('MONGO_PASS')
if MONGO_PASS is None:
    print('supply a mongo password by exporting `MONGO_PASS`')
    exit()
if len(sys.argv) < 2:
    print('usage: python merge_mongo.py <calendar>')
    exit()
CALENDAR = sys.argv[1]

all_courses = []

for i in os.listdir(f'data/courses/{CALENDAR}'):
    courses = open(f'data/courses/{CALENDAR}/{i}').read()
    courses = json.loads(courses)
    for c in range(len(courses)):
        courses[c]['code'] = i[:-5]
    all_courses += courses

dump = open(f'data/{CALENDAR}.json', 'w+')
dump.write(json.dumps(all_courses, indent=4))

def get_db():
    client = pymongo.MongoClient(f"mongodb+srv://client:{MONGO_PASS}@winzard.dnvuply.mongodb.net/?retryWrites=true&w=majority")
    return client['winzard']

def get_all_courses(calendar='fall2024'):
    courses = []
    for path in os.listdir(f'data/courses/{calendar}/'):
        courses += json.load(open(f'data/courses/{calendar}/{path}'))
    return courses

if __name__ == '__main__':
    db = get_db()
    options = db['course_options_' + CALENDAR]
    options.delete_many({})
    options.insert_many(get_all_courses(CALENDAR))