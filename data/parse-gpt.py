# get all files in 'single' folder

import os, json, re

parsed_list = []

for f in os.listdir('single'):
    file = open(f'single/{f}', 'r').read()
    objects = file.split('\n\n')
    try:
        for o in objects:
            parsed_list += [json.loads(o)]
    except json.decoder.JSONDecodeError:
        print(f)
        continue

json.dump(parsed_list, open('gpt-calendar-combined.json', 'w'))