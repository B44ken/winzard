import pymongo, os, json

MONGO_PASS = os.environ.get('MONGO_PASS')

def get_db():
    client = pymongo.MongoClient(f"mongodb+srv://client:{MONGO_PASS}@winzard.dnvuply.mongodb.net/?retryWrites=true&w=majority")
    return client['winzard']

def get_all_courses(semester='winter2024'):
    courses = []
    for path in os.listdir(f'../data/courses/{semester}/'):
        courses += json.load(open(f'../data/courses/{semester}/{path}'))
    return courses

if __name__ == '__main__':
    db = get_db()
    options = db['course_options_winter2024']
    options.delete_many({})
    options.insert_many(get_all_courses())
