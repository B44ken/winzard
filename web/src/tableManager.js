let cache = {}
let pendingCourses = false


const getCourse = (code) =>
    new Promise((resolve, reject) => {
        if(cache[code] !== undefined)
            resolve(cache[code])
        else {
            fetch(`https://boratto.ca/winzard/api/options?code=${code}`)
                .then(r => r.json())
                .then(course => { 
                    cache[code] = course
                    resolve(course)
                })
        }
    })

let testCourses = ["COMP1410", "COMP2650", "MATH1730", "MATH1020", "STAT2910"]

const fetchCourses = async (codes) => {
    let courses = []
    for (const code of codes) {
        await getCourse(code)
        if(cache[code].length == 0) {
            alert(`No options found for ${code}`)
        }
        // set time intervals (mutate cache for efficiency)
        for(const option of cache[code]) {
            option.TimeInterval = []
            for(const day of option.Times.Lecture.Days) {
                const dayMin = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].indexOf(day) * 24 * 60
                const hourStartMin = parseInt(option.Times.Lecture.Hours[0].split(":")[0]) * 60
                const minutStartMin = parseInt(option.Times.Lecture.Hours[0].split(":")[1])
                const startMin = dayMin + hourStartMin + minutStartMin
                const hourEndMin = parseInt(option.Times.Lecture.Hours[1].split(":")[0]) * 60
                const minutEndMin = parseInt(option.Times.Lecture.Hours[1].split(":")[1])
                const endMin = dayMin + hourEndMin + minutEndMin
                option.TimeInterval.push([startMin, endMin])
            }
            for(const day of (option.Times.Lab.Days || [])) {
                const dayMin = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].indexOf(day) * 24 * 60
                const hourStartMin = parseInt(option.Times.Lab.Hours[0].split(":")[0]) * 60
                const minutStartMin = parseInt(option.Times.Lab.Hours[0].split(":")[1])
                const startMin = dayMin + hourStartMin + minutStartMin
                const hourEndMin = parseInt(option.Times.Lab.Hours[1].split(":")[0]) * 60
                const minutEndMin = parseInt(option.Times.Lab.Hours[1].split(":")[1])
                const endMin = dayMin + hourEndMin + minutEndMin
                option.TimeInterval.push([startMin, endMin])
            }
        }
        const random = Math.floor(cache[code].length * Math.random())
        courses.push(cache[code])
    }
    courses = courses.sort((a, b) => a.Code > b.Code ? 1 : -1)
    return courses
}

const cartesian = (...all) => {
    const loop = (t, a, ...more) =>
      a === undefined ? [ t ] : a.flatMap(x => loop([ ...t, x ], ...more))
    return loop([], ...all)
  }  

const listAllPermutations = (options, perm=[]) => {
    if(options.length === 0 && perm.length == 0) return []

    const O = options.pop()
    perm.unshift(O.map((o, i) => i))
    if(options.length === 0)
        return cartesian(...perm)

    return listAllPermutations(options, perm)
}

const optimizePermutations = 0

const getPermutation = (options, chosen) => {
    const perm = []
    for(const i in chosen) {
        perm.push(options[i][chosen[i]])
    }
    return perm
}

const coursesOverlap = (list) => {
    const intervals = listAllIntervals(list).sort((a, b) => a[0] - b[0])
    for(let i = 0; i < intervals.length - 1; i++) {
        if(intervals[i][1] > intervals[i+1][0])
            return true
    }
    return false
}

const listAllIntervals = (list) => {
    const intervals = []
    for(const course of list)
        intervals.push(...course.TimeInterval)
    return intervals
}

const withinTime = (perm, time) => {
    const intervals = listAllIntervals(perm).map(i => [i[0]%(24*60), i[1]%(24*60)])
    for(const int of intervals) {
        if(int[0] < time[0] || int[1] > time[1])
            return false
    }
    return true
}

const findValid = (courses, permutations, permutationID, direction) => {
    permutationID += direction
    const permutation = getPermutation(courses, permutations[permutationID])
    if(permutationID < 0 || permutationID >= permutations.length)
        return permutationID - direction
    if(coursesOverlap(permutation))
        return findValid(courses, permutations, permutationID, direction)
    return permutationID 
}

const scoreSchedule = (courses) => {
    const intervals = listAllIntervals(courses)
    const days = [[], [], [], [], []]

    for(const int of intervals) {
        const day = Math.floor(int[0] / 1440)
        days[day].push(int)
    }

    let extents = []
    for(const day of days) {
        const min = Math.min(...day.map(e => e[0]))
        const max = Math.max(...day.map(e => e[1]))
        extents.push([min % 1440, max % 1440])
    }

    const longest = extents.map(e => e[1] - e[0]).sort((a, b) => b - a)
    return longest[0] * 100 + longest[1]
}

export { fetchCourses, listAllPermutations, getPermutation, coursesOverlap, findValid, listAllIntervals, scoreSchedule, withinTime }