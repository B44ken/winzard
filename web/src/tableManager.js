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
        // set time intervals (mutate cache)
        for(const option of cache[code]) {
            option.TimeInterval = []
            for(const day of option.Times.Lab.Days) {
                const dayMin = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].indexOf(day) * 24 * 60
                const hourStartMin = parseInt(option.Times.Lab.Hours[0].split(":")[0]) * 60
                const minutStartMin = parseInt(option.Times.Lab.Hours[0].split(":")[1])
                const startMin = dayMin + hourStartMin + minutStartMin
                const hourEndMin = parseInt(option.Times.Lab.Hours[1].split(":")[0]) * 60
                const minutEndMin = parseInt(option.Times.Lab.Hours[1].split(":")[1])
                const endMin = dayMin + hourEndMin + minutEndMin
                option.TimeInterval.push([startMin, endMin])
            }
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
        }
        const random = Math.floor(cache[code].length * Math.random())
        courses.push(cache[code])
    }
    courses = courses.sort((a, b) => a.Code > b.Code ? 1 : -1)
    return courses
}

const cartesian = (...all) => {
    const loop = (t, a, ...more) =>
      a === undefined
        ? [ t ]
        : a.flatMap(x => loop([ ...t, x ], ...more))
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

const getPermutation = (options, chosen) => {
    const perm = []
    for(const i in chosen) {
        perm.push(options[i][chosen[i]])
    }
    return perm
}

const coursesOverlap = (list) => {
    const intervals = []
    for(const course of list)
        intervals.push(...course.TimeInterval)
    intervals.sort((a, b) => a[0] - b[0])
    for(let i = 0; i < intervals.length - 1; i++) {
        if(intervals[i][1] > intervals[i+1][0])
            return true
    }
    return false
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

const timeSpentAtSchool = (courses) => {
    let start = [0, 0, 0, 0, 0]
    let stop = [24*60, 24*60, 24*60, 24*60, 24*60]
    for(const course of courses) {
        for(const interval of course.TimeInterval) {
            const day = Math.floor(interval[0] / (24 * 60))
            if(start[day] == 0 || interval[0] < start[day])
                start[day] = interval[0]
            if(stop[day] == 0 || interval[1] > stop[day])
                stop[day] = interval[1]
        }
    }
    return stop.map((e, i) => e - start[i]).reduce((a, b) => a + b, 0)
}


export { fetchCourses, listAllPermutations, getPermutation, coursesOverlap, findValid, timeSpentAtSchool }