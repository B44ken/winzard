import React, { useEffect, useState } from 'react'

const Table = ({ schedule }) => {
    const scheduleDays = {}
    for(const course of schedule) {
        const lectureTimes = course.Times.Lecture.Hours
        const lectureDays = course.Times.Lecture.Days
        for(const day of lectureDays) {
            if(!scheduleDays[day]) {
                scheduleDays[day] = []
            }
            scheduleDays[day].push({
                code: course.Code,
                type: "lecture",
                times: lectureTimes,
            })
        }
        if(course.Times.Lab == undefined) continue
        const labTimes = course.Times.Lab.Hours
        const labDays = course.Times.Lab.Days || []
        for(const day of labDays) {
            if(!scheduleDays[day]) {
                scheduleDays[day] = []
            }
            scheduleDays[day].push({
                code: course.Code,
                type: "lab",
                times: labTimes,
            })
        }

    }

    const wholeDay = ["8:00", "22:00"]

    return <>
     <div className="grid grid-cols-5 gap-4 mb-4">
      <Column name="Monday" schedule={scheduleDays.Monday} wholeDay={wholeDay} />
      <Column name="Tuesday" schedule={scheduleDays.Tuesday} wholeDay={wholeDay} />
      <Column name="Wednesday" schedule={scheduleDays.Wednesday} wholeDay={wholeDay} />
      <Column name="Thursday" schedule={scheduleDays.Thursday} wholeDay={wholeDay} />
      <Column name="Friday" schedule={scheduleDays.Friday} wholeDay={wholeDay} />
    </div>
    </>
}

const Course = ({ data, text, top, height }) => {
    return <div className="border-l-2 border-gray-300 pl-1 absolute w-full" style={{
        "top": top,
        "height": height,
    }}>
        {data.code} {data.type} <br />
        {data.times.join(' - ').replace(" ", "\xa0")}
    </div>
}

const Column = ({ name, schedule }) => {
    if(schedule === undefined) {
        return <div className="column-day">
        <p className="column-day-name">{ name }</p>
        <div className="column-content">
            <div className="column-lines"> </div>
        </div>
    </div>
    }
    const minutes = (hhmm) => Number(hhmm.split(":")[0]) * 60 + Number(hhmm.split(":")[1])
    const scale = (t, min=8*60, max=22*60) => {
        return (t - min)/(max - min) 
    }
    const scaleTime = (time) => {
        return time.map(minutes).map(e => scale(e))
    }

    let courses = []
    for(const course of schedule) {
        const time = scaleTime(course.times)
        const totalHeight = 567
        const top = totalHeight * time[0]
        const height = totalHeight * time[1] - top

        courses.push(<Course data={course} top={top} height={height} key={Math.random()} />)    
    }


    return <>
      <div className="m-2 rounded-lg mt-4 relative">
        <h2 className="font-bold text-center">{ name }</h2>
        { courses }
      </div>
    </>
}

export default Table