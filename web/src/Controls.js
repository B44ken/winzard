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

const Controls = ({ courseCodes, setCourseCodes, permutation, setPermutation, find }) => {
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