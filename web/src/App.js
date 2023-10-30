import React, { useEffect, useState } from 'react';
import Controls from './Controls';
import TimetableTable from './TimetableTable';

import { testCourses, getTestCourses, listAllPermutations, getPermutation, coursesOverlap, findNextValid, findLastValid } from './tableManager'

const App = () => {
  const [schedule, setSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [permutationID, setPermutationID] = useState(2)
  const [permutations, setPermutations] = useState([])
  
  useEffect(() => {
    (async () => {
      const courses = await getTestCourses()
      const permutations = listAllPermutations([...courses])
      const permutation = getPermutation(courses, permutations[permutationID])
      setCourses(courses)
      setSchedule(permutation)
      setPermutations(permutations)
    })()
  }, [permutationID])

  const next = () => {
    const id = findValid(courses, permutations, permutationID, 1)
    setPermutationID(id)    
  }

  const last = () => {
    const id = findValid(courses, permutations, permutationID, -1)
    setPermutationID(id)
  }

  return <>
    <div className="main">
      <TimetableTable schedule = {schedule} />
      <Controls courses={courses} setCourses={setCourses} permutation={permutationID} next={next} last={last} />
    </div>
    </>
}

export default App;
