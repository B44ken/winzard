import React, { useEffect, useState } from 'react';
import Controls from './Controls';
import Table from './Table';

import { fetchCourses, listAllPermutations, getPermutation, coursesOverlap, findValid, scoreSchedule } from './tableManager'

const App = () => {
  const [schedule, setSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [courseCodes, setCourseCodes] = useState(["COMP1410", "COMP2650", "MATH1730", "MATH1020", "STAT2910"])
  const [permutationID, setPermutationID] = useState(0)
  const [permutations, setPermutations] = useState([])
  
  useEffect(() => {
    (async () => {
      const courses = await fetchCourses(courseCodes)
      // this stuff shouldn't be here
      let permutations = listAllPermutations([...courses])
      permutations = permutations.filter(p => !coursesOverlap(getPermutation(courses, p)))
      permutations = permutations.sort((a, b) =>
      scoreSchedule(getPermutation(courses, a)) - scoreSchedule(getPermutation(courses, b))
      )
      const permutation = getPermutation(courses, permutations[permutationID])
      setCourses(courses)
      setSchedule(permutation)
      setPermutations(permutations)
    })()
  }, [courseCodes])

  useEffect(() => {
    const permutation = getPermutation(courses, permutations[permutationID])
    console.log(scoreSchedule(permutation))
    setSchedule(permutation)
  }, [permutationID])

  const find = (dir) => setPermutationID(findValid(courses, permutations, permutationID, dir))

  return <>
    <div className="page">  
      <h1>Winzard Timetable Very-Pre-Alpha</h1>
      <div className="main">
        <Table schedule={schedule} />
        <Controls courseCodes={courseCodes} setCourseCodes={setCourseCodes} permutation={permutationID} setPermutation={setPermutationID} find={find} />
      </div>
    </div>
    </>
}

export default App;
