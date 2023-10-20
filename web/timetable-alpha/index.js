let timetable = {}
fetch('timetable-f2023.json')
    .then(res => res.json())
    .then(data => timetable = data)


const searchesRegex = /[A-z]+=[^&]+/.exec(document.location.search.slice(1))
// const searches  = {}
// for(const search of [...searchesRegex]) {
//     const [key, value] = search.split('=')
//     searches[key] = value
// }

// const coursePlan = searches['courses'].split(',')

const coursePlan = document.querySelector('.input-classes').value.split(', ')

function cartesianProduct(input, current) {
    if (!input || !input.length) { return []; }
 
    var head = input[0];
    var tail = input.slice(1);
    var output = [];
 
     for (var key in head) {
       for (var i = 0; i < head[key].length; i++) {
             var newCurrent = copy(current);         
             newCurrent[key] = head[key][i];
             if (tail.length) {
                  var productOfTail = 
                          cartesianProduct(tail, newCurrent);
                  output = output.concat(productOfTail);
             } else output.push(newCurrent);
        }
      }    
     return output;
}
 
function copy(obj) {
   var res = {};
   for (var p in obj) res[p] = obj[p];
   return res;
}

const sectionIntervals = (section) => {
    const days = section.days.replace('TH', 't').split('')
    const dayMinutes = days.map(d => ["M", "T", "W", "t", "F"].indexOf(d) * 24 * 60)

    const start = section.time.start.split(':')
    let startHour = parseInt(start[0])
    if(section.time.start.includes('PM') && startHour != 12)
        startHour += 12
    const startMinute = parseInt(start[1]) + startHour * 60

    const end = section.time.end.split(':')
    let endHour = parseInt(end[0])
    if(section.time.end.includes('PM') && endHour != 12)
        endHour += 12
    const endMinute = parseInt(end[1]) + endHour * 60

    const intervals = dayMinutes.map(d => [d + startMinute, d + endMinute])
    return intervals
}

const allTimetables = (coursePlan) => {
    const intervalsList = []
    for(course of coursePlan) {
        const intervals = timetable[course].sections.map(sectionIntervals)
        const dict = {}
        dict[course] = intervals
        intervalsList.push(dict)
    }
    const allCombinations = cartesianProduct(intervalsList)
    return allCombinations
}

const minuteToDate = (minutes) => {    
    const day = Math.ceil(minutes / (24 * 60))
    const dayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][(day - 1) % 5]
    const hour = Math.floor((minutes % (24 * 60)) / 60)
    const minute = minutes % 60
    return `${dayName} ${hour}:${minute.toString().padStart(2, '0')}`
}

const verifyTimetable = (timetable) => {
    const intervals = Object.values(timetable).flat()
        .sort((a, b) => a[0] - b[0])

    for(const int in intervals) {
        if(int == 0) continue
        if(intervals[int][0] < intervals[int - 1][1])
            return false
    }
    return true
}

let timetablesList = []
setTimeout(() => {
    const allTT = allTimetables(coursePlan).filter(verifyTimetable)
    const humanTimetables = []
    for(const TT of allTT) {
        const humanTT = []
        for(const course in TT) {
            for(const section of TT[course]) {
                humanTT.push([course, minuteToDate(section[0]), minuteToDate(section[1])])
            }
        }
        // if(earliestStart(humanTT) >= 8 && latestEnd(humanTT) <= 22)
            humanTimetables.push(humanTT)
    }
    timetablesList = humanTimetables.sort((a, b) => longestDay(a) - longestDay(b))
}, 1000)
