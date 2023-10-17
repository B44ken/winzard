let timetable = {}
fetch('timetable-f2023.json')
    .then(res => res.json())
    .then(data => timetable = data)

const coursePlan = ["COMP-1400", "COMP-1000", "MATH-1720", "MATH-1250", "PHIL-1290"]

const sectionIntervals(section) {
    // format: 
    const days = section.days.replace('TH', 't').split('')
    const dayMinutes = days.map(d => ["M", "T", "W", "t", "F"].indexOf(d)) * 24 * 60

    const start = section.startTime.split(':')
    let startHour = parseInt(start[0])
    if(section.startTime.includes('PM') && startHour != 12)
        startHour += 12
    const startMinute = parseInt(start[1]) + startHour * 60

    const end = section.endTime.split(':')
    let endHour = parseInt(endTime[0])
    if(section.endTime.includes('PM') && endHour != 12)
        endHour += 12
    const endMinute = parseInt(end[1]) + endHour * 60

    const intervals = dayMinutes.map(d => [d + startMinute, d + endMinute])
    return intervals
}

const allTimetables(coursePlan) {
    const sectionIntervals = coursePlan.map(c => sectionIntervals(timetable[c].sections)

}

setTimeout(() => {
    let c1400i = sectionIntervals(timetable["COMP-1400"].sections[0])
    console.log(c1400i)
}, 1000)