import React, { useEffect, useState } from 'react';
import Controls from './Controls';
import Table from './Table';

import { fetchCourses, listAllPermutations, getPermutation, coursesOverlap, findValid, filterValid} from './tableManager'

const App = () => {
  const [schedule, setSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [courseCodes, setCourseCodes] = useState(["COMP1410", "COMP2650", "MATH1730", "MATH1020", "STAT2910"])
  const [permutationID, setPermutationID] = useState(0)
  const [permutations, setPermutations] = useState([])
  
  useEffect(() => {
    (async () => {
      const courses = await fetchCourses(courseCodes)
      let permutations = listAllPermutations([...courses])
      permutations = permutations.filter(p => !coursesOverlap(getPermutation(courses, p)))
      const permutation = getPermutation(courses, permutations[permutationID])
      setCourses(courses)
      setSchedule(permutation)
      setPermutations(permutations)
    })()
  }, [permutationID, courseCodes])

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
