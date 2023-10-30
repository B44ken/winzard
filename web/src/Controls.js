const Controls = ({ courses, setCourses, permutation, next, last }) => {
    return <div className="rounded-corners controls">
        <div>
            <p><b>Course Selection:</b>
            {/* { courses.map(course => <><br /> { course[0].Code } </>) } */}
            </p>
            Permutation: <br />
            <button onClick={() => last()} >-</button>
            {/* { permutation } */}
            <button onClick={() => next()} >+</button>
        </div>
    </div>
}

export default Controls