courses=`cat calendar/calendar.txt | grep -Po '[A-Z]{4}(?=.\d{4})' | sort | uniq`
max_jobs=5

cd uwinsite

for course in $courses; do
    python3 download.py $course &
    while [ $(jobs | wc -l) -ge 10 ]; do
        sleep 1
    done
done

while [ $(jobs | wc -l) -gt 0 ]; do
    sleep 1
done