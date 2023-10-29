const Controls = ({ courses, setCourses, permutation, next, last }) => {
    return <div className="rounded-corners controls">
        <div>
            Permutation: <br />
            <button onClick={() => last()} >-</button>
            {/* { permutation } */}
            <button onClick={() => next()} >+</button>
        </div>
    </div>
}

export default Controls