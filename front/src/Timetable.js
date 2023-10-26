import React, { useEffect, useState } from 'react'

const Timetable = () => {
    const [schedule, setSchedule] = useState([])

    useEffect(() => {
        fetch("https://boratto.ca/winzard/api/options?code=COMP1410")
            .then(r => r.json())
            .then(setSchedule)
    })


    const wholeDay = ["6:00", "23:00"]

    // day filtering logic is a little cleaner in the days themselves
    return <div className="days">
        <Column name="Monday" schedule={schedule} wholeDay={wholeDay} />
        <Column name="Tuesday" schedule={schedule} wholeDay={wholeDay} />
        <Column name="Wednesday" schedule={schedule} wholeDay={wholeDay} />
        <Column name="Thursday" schedule={schedule} wholeDay={wholeDay} />
        <Column name="Friday" schedule={schedule} wholeDay={wholeDay} />
    </div>
}

const Course = ({ text, top, height }) => {
    return <p className="course" style={{ top: top, height: height }}>
        { text }
    </p>
}

const Column = ({ name, schedule, wholeDay }) => {
    schedule = schedule.filter(course => 
        course.Times.Lecture.Days.includes(name) || course.Times.Lab?.Days.includes(name)
        )
    const minutes = (hhmm) => Number(hhmm.split(":")[0]) * 60 + Number(hhmm.split(":")[1])
    const scale = (t, min=6*60, max=23*60) => {
        return (t - min)/(max - min) 
    }
    const scaleTime = (time) => {
        return time.map(minutes).map(e => scale(e))
    }

    let courses = []
    console.log(schedule)
    for(const course of schedule) {
        const time = scaleTime(course.Times.Lecture.Hours)
        console.log(course.Times.Lecture.Hours, time)
        const totalHeight = 600 - 33
        const top = totalHeight * time[0]
        const height = totalHeight * time[1] - top
        console.log(top, height)
        courses.push(<Course text={course.Code} top={top} key={Math.random()} />)    
    }

    return <div className="column-day">
        <p className="column-day-name">{ name }</p>
        <div className="column-content">
            <div className="column-lines">
            </div>
            { courses }
        </div>
    </div>
}

export default Timetable