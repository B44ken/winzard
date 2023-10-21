const config = {
    start: 7,
    end: 24,
}

const scaleNumber = (x, oldMin, oldMax, newMin, newMax) =>
    (x - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin

const parseTime = (time, scale=false) => {
    const [hour, minute] = time.split(':')
    const t = parseInt(hour) + parseInt(minute) / 60
    if(scale)
        return scaleNumber(t, config.start, config.end, 1, 24)
    else return t
}

const addCalendar = (entry) => {
    const day = entry[1].split(' ')[0]
    const dayElement = document.querySelector(`.day.` + day.toLowerCase())
    const start = parseTime(entry[1].split(' ')[1], scale=true)
    const end = parseTime(entry[2].split(' ')[1], scale=true)

    const element = document.createElement('div')
    element.classList.add('calendar-entry')
    element.style.top = `${(start) * 27}px`
    element.style.height = `${Math.max((end - start) * 27, 40)}px`
    const elementText = entry[0].replace(/-1$/, ' LAB') + '\n' + entry[1].split(' ')[1] + ' - ' + entry[2].split(' ')[1]
    element.innerText = elementText
    dayElement.appendChild(element)
}


const clearEntries = () => {
    document.querySelectorAll('.calendar-entry').forEach(e => e.remove())
}

let timetableNumber = document.querySelector('.timetable-number')
timetableNumber.addEventListener('input', () => {
    clearEntries()
    timetablesList[timetableNumber.value].map(addCalendar)
})

const earliestStart = (timetable) => {
    let earliest = 24 * 60
    for(const entry of timetable) {
        const start = parseTime(entry[1].split(' ')[1])
        if(start < earliest) {
            earliest = start
        }
    }
    return earliest
}

const latestEnd = (timetable) => {
    let latest = 0
    for(const entry of timetable) {
        const end = parseTime(entry[2].split(' ')[1])
        if(end > latest) {
            latest = end
        }
    }
    return latest
}

const totalHours = (timetable) => {
    let latest = {}
    let earliest = {}
    for(const entry of timetable) {
        const day = entry[1].split(' ')[0]
        const start = parseTime(entry[1].split(' ')[1])
        const end = parseTime(entry[2].split(' ')[1])
        if(!(day in earliest)) {
            earliest[day] = start
            latest[day] = end
        }
        else {
            earliest[day] = Math.min(start, earliest[day])
            latest[day] = Math.max(end, latest[day])
        }
    }
    let total = 0
    for(const day in earliest) {
        total += latest[day] - earliest[day]
    }
    return total
}

const longestDay = (timetable) => {
    let latest = {}
    let earliest = {}
    for(const entry of timetable) {
        const day = entry[1].split(' ')[0]
        const start = parseTime(entry[1].split(' ')[1])
        const end = parseTime(entry[2].split(' ')[1])
        if(!(day in earliest)) {
            earliest[day] = start
            latest[day] = end
        }
        else {
            earliest[day] = Math.min(start, earliest[day])
            latest[day] = Math.max(end, latest[day])
        }
    }
    let longest = 0
    for(const day in earliest) {
        longest = Math.max(latest[day] - earliest[day], longest)
    }
    return longest
}