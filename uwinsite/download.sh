courses=`cat calendar/calendar.txt | grep -Po '[A-Z]{4}(?=.\d{4})' | sort | uniq`

cd uwinsite

for course in $courses; do
    python3 uwinsite/download.py $course
done