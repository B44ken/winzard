import pymongo, os, json

MONGO_PASS = os.environ.get('MONGO_PASS')

def get_db():
    client = pymongo.MongoClient(f"mongodb+srv://b44ken:{MONGO_PASS}@winzard.0puyoun.mongodb.net/?retryWrites=true&w=majority")
    return client['winzard']

def read_all_courses():
    courses = []
    for path in os.listdir(f'school/'):
        if path == 'all.json':
            continue
        courses += json.load(open(f'school/{path}/calendar.json'))

    for i in courses:
        i['code'] = i['code'].replace('-', '')
    return courses

if __name__ == '__main__':
    db = get_db()
    options = db['course_details']
    options.delete_many({})
    options.insert_many(read_all_courses())
