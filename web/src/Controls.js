import { useRef } from "react"

const CourseTag = ({ name, removeCourse }) => {
    return <div className="course-tag">
        <div className="course-tag-name">{ name }</div>
        <button className="course-tag-button" onClick={() => removeCourse(name)}>x</button>
    </div>
}

const CourseSearch = ({ addCourse }) => {
    const inputRef = useRef("")
    const add = () => {
        addCourse(inputRef.current.textContent)
    }

    return <div className="course-tag">
        <div contentEditable="true" ref={inputRef} />
        <button onClick={add}>+</button>
    </div>

}

const TimeSetter = ({ set, name }) => {
    return <p>
        <b>{ name }</b> <br />
        <input type="time" onChange={e => {
            const [hour, min] = e.target.value.split(":")
            set(Number(hour * 60) + Number(min))  
        }} />
    </p>
}

const Controls = ({ courseCodes, setCourseCodes, permutation, setPermutation, setEarliest, setLatest, find }) => {
    const removeCourse = (code) => {
        setPermutation(0)
        setCourseCodes(courseCodes.filter(i => i !== code))
    }
    const addCourse = (code) => {
        setPermutation(0)
        const newCodes = [...courseCodes, code]
        setCourseCodes(newCodes)
    }

    return <div className="rounded-corners controls">
        <div>
            <b>Course Selection:</b>
            <CourseSearch addCourse={addCourse} />
            { courseCodes?.map(i => 
                <CourseTag name={i} key={i} removeCourse={removeCourse} />
            ) }

            <TimeSetter set={setEarliest} name="Earliest Time" value="8:30:00" />
            <TimeSetter set={setLatest} name="Latest Time" value="22:00:00"/>

            <b>Permutation:</b> <br />
            <div className="permutation-controls">
                <button onClick={() => find(-1)} >-</button>
                <div>{ permutation }</div>
                <button onClick={() => find(1)} >+</button>
            </div>
        </div>
    </div>
}

export default Controls