import os, openai, re, json, time

folder='school/COMP/'

openai.api_key = os.getenv("OPENAI_API_KEY")
calendar_text = open(folder + 'calendar.txt', 'r', errors='ignore').read()

def gpt_course_json(text):
    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {
        "role": "system",
        "content": "I am going to give you entries from my school's course listing\nIf I input something that is not a course, return an error object. \nIf I input a course, but it's cut short, return an error.\n I want you to turn the entry into a JSON object containing the keys \"prerequisites\", \"corequisites\", \"labHours\", \"lectureHours\", \"courseCode\", \"courseName\".\nBy default, a course has 0 lab and 3 lecture hours.\nOnly return JSON."
        },
        {
        "role": "user",
        "content": "MATH-3580. Introduction to Analysis I\nThis course is a rigorous and proof-based study of supremum and infimum, the real number system.\n(Prerequisites: MATH-1020 and one of MATH-1250, MATH-1260 or MATH-1270.) (3 lecture hours, 1 tutorial hour per week.)"
        },
        {
        "role": "assistant",
        "content": "{\"prerequisites\":[\"MATH-1020\",\"MATH-1250 or MATH-1260 or MATH-1270\"],\"labHours\":1,\"lectureHours\":3,\"courseCode\":\"MATH-3580\",\"courseName\":\"Introduction to Analysis I\",\"corequisites\":[], \"specialNotes\":\"\"}"
        },
        {
            "role": "user",
            "content": text,
        }
    ],
    temperature=0.7,
    max_tokens=512,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )

    return response['choices'][0]['message']['content']

course_json = []

for C in range(0, len(calendar_text.split('\n\n'))):
    chunk = calendar_text.split('\n\n')[C]
    try:
        time.sleep(0)
        if not re.match(r'^[A-Z]{4}(-| )[0-9]{4}', chunk):
            continue
        converted = gpt_course_json(chunk)
        course_json += [json.loads(converted)]
    except openai.error.ServiceUnavailableError:
        # write to list of failed courses
        open(folder + 'failed_courses.txt', 'a+').write(chunk[:9] + '\n')
        time.sleep(60)
    except KeyboardInterrupt:
        break

json.dump(course_json, open(folder + 'calendar.json', 'w'))