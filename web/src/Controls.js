import { useRef } from "react"

const CourseTag = ({ name, removeCourse }) => {
    return <div className="rounded-lg bg-gray-900 font-bold uppercase text-white m-1 text-left relative w-60 center mx-auto text-xs m-1">
        <div className="p-2 inline-block">{name}</div>
        <button className="rounded-lg right-0 text-lg p-0 pr-3 absolute" onClick={() => removeCourse(name)}>
            ×
        </button>
    </div>
}

const CourseSearch = ({ addCourse }) => {
    const inputRef = useRef("")
    const add = () =>
        addCourse(inputRef.current.textContent)

    return <div className="course-tag">
        <div contentEditable="true" ref={inputRef} />
        <button onClick={add}>+</button>
    </div>

}

const TimeSetter = ({ set, name, value }) => {
    return <div className="p-2">
        <b>{name}</b> <br />
        <input type="time" onChange={e => {
            const [hour, min] = e.target.value.split(":")
            set(Number(hour * 60) + Number(min))
        }} defaultValue={value} />
    </div>
}

const Controls = ({ find, state }) => {
    const removeCourse = (code) => {
        state.setPermutationID(0)
        state.setCourseCodes(state.courseCodes.filter(i => i !== code))
    }
    const addCourse = (code) => {
        state.setPermutationID(0)
        const newCodes = [...state.courseCodes, code]
        state.setCourseCodes(newCodes)
    }

    return <div className="rounded-corners controls text-center">
        <div className="flex flex-row flex-center justify-center">
            <select onChange={e => state.setCalendar(e.target.value)} defaultValue={state.semester}>
                <option value="spring2024">Spring 2024</option>
                <option value="fall2024">Fall 2024</option>
            </select>
        </div>

        <div className="flex flex-row flex-center justify-center">
            <TimeSetter set={state.setEarliest} name="Earliest Time" value={state.earliest} />
            <TimeSetter set={state.setLatest} name="Latest Time" value={state.latest} />
        </div>

        <b>Permutation</b>
        <div className="flex flex-row flex-center justify-center space-x-4">
            <button className="bg-gray-900 text-white p-1 rounded-lg w-8" onClick={() => find(-1)} >-</button>
            <div className="p-1 w-20 text-center">{state.permutationID + 1} / {state.permutations.length} </div>
            <button className="bg-gray-900 text-white p-1 rounded-lg w-8" onClick={() => find(1)} >+</button>
        </div>
        <b>Course Selection</b>
        {state.courseCodes.map(i =>
            <CourseTag name={i} key={i} removeCourse={removeCourse} />
        )}
    </div>
}

export default Controls