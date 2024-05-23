import pymongo, os, json

MONGO_PASS = os.environ.get('MONGO_PASS')
CALENDAR = 'fall2024'

def get_db():
    client = pymongo.MongoClient(f"mongodb+srv://client:{MONGO_PASS}@winzard.dnvuply.mongodb.net/?retryWrites=true&w=majority")
    return client['winzard']

def get_all_courses(calendar='fall2024'):
    courses = []
    for path in os.listdir(f'../data/courses/{calendar}/'):
        courses += json.load(open(f'../data/courses/{calendar}/{path}'))
    return courses

if __name__ == '__main__':
    db = get_db()
    options = db['course_options_' + CALENDAR]
    options.delete_many({})
    options.insert_many(get_all_courses())
