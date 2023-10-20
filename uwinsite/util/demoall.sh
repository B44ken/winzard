# for every line in file:
for i in `cat data/allcourses.txt`
do
    python3 demo.py search="$(echo $i | cut -c1-4) $(echo $i | cut -c5-8)"
done