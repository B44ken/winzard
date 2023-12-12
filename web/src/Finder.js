import { useState } from "react"

const Result = ({ json, addCourse }) => {
    return <div className="search-result">
        <b>{ json.Code } </b> <button onClick={() => addCourse(json.Code)}>Add</button>
        <p>{ json.Name.trim() } ({ json.LectureHours + json?.LabHours } hours)</p>
    </div>

}

export default ({ courseCodes, setCourseCodes }) => {
    const [results, setResults] = useState([])

    const addCourse = (code) => 
        setCourseCodes([...courseCodes, code])

    const search = async (event) => {
        const results = await fetch("https://boratto.ca/winzard/api/details?search=" + event.target.value)
        const json = await results.json()
        setResults(json.slice(0, 5))
    }

    return (
        <div className="overflow-hidden">
            <b>Add a Course</b> <br />
            <input type="text" className="bg-transparent border-b-2 border-gray-900 mx-auto inline-block w-120" placeholder="Search..." onChange={search} />
            { results.map(r => <Result json={r} addCourse={addCourse} />) }
        </div>
    )
}