import React, { useEffect, useState } from 'react';
import Controls from './Controls';
import Table from './Table';
import Finder from './Finder';

import { fetchCourses, listAllPermutations, getPermutation, coursesOverlap, findValid, scoreSchedule, withinTime } from './tableManager'

const App = () => {
  const [schedule, setSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [courseCodes, setCourseCodes] = useState(["COMP1410", "MATH1730"])
  const [permutationID, setPermutationID] = useState(0)
  const [permutations, setPermutations] = useState([])
  const [earliest, setEarliest] = useState(0)
  const [latest, setLatest] = useState(24*60)
  const state = {
    schedule, setSchedule, courses, setCourses, courseCodes, setCourseCodes, permutationID, setPermutationID, permutations, setPermutations, earliest, setEarliest, latest, setLatest
  }
  
  useEffect(() => {
    (async () => {
      const courses = await fetchCourses(courseCodes)
      // this stuff shouldn't be here
      let permutations = listAllPermutations([...courses])
      permutations = permutations.filter(p => {
        const perm = getPermutation(courses, p)
        return !coursesOverlap(perm) && withinTime(perm, [earliest, latest])
      })
      permutations = permutations.sort((a, b) =>
        scoreSchedule(getPermutation(courses, a)) - scoreSchedule(getPermutation(courses, b))
      )
      const permutation = getPermutation(courses, permutations[permutationID])
      setCourses(courses)
      setSchedule(permutation)
      setPermutations(permutations)
    })()
  }, [courseCodes, earliest, latest])

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
        <Controls courseCodes={courseCodes} setCourseCodes={setCourseCodes} permutation={permutationID} setPermutation={setPermutationID} find={find} setEarliest={setEarliest} setLatest={setLatest} />
        <Finder courseCodes={courseCodes} setCourseCodes={setCourseCodes} />
      </div>
    </div>
    </>
}

export default App;
