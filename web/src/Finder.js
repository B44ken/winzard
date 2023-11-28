import { useState } from "react"

const Result = ({ json, addCourse }) => {
    return <div className="search-result">
        <b>{ json.Code } </b> <button onClick={() => addCourse(json.Code)}>Add</button>
        <p>{ json.Name.trim() } ({ json.LectureHours + json?.LabHours } hours)</p>
    </div>

}

export default ({ courseCodes, setCourseCodes }) => {
    const [results, setResults] = useState([])

    const addCourse = (code) => {
        setCourseCodes([...courseCodes, code])
    }

    const search = async (event) => {
        const results = await fetch("https://boratto.ca/winzard/api/details?search=" + event.target.value)
        const json = await results.json()
        console.log(json)
        setResults(json.slice(0, 5))
    }

    return (
        <div className="controls" style={{width:400}}>
            <div className="header" style={{height: "15%"}}>
                <h1>Add a Course</h1>
                <input type="text" placeholder="Search" onChange={search} />
            </div>
            <div className="results" style={{height: "80%"}}>
                { results.map(r => <Result json={r} addCourse={addCourse} />) }
            </div>
        </div>
    )
}