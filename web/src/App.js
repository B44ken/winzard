import React, { useEffect, useState } from 'react';
import Controls from './Controls';
import Table from './Table';
import Finder from './Finder';

import { fetchCourses, listAllPermutations, getPermutation, coursesOverlap, findValid, scoreSchedule, withinTime } from './tableManager'

const App = () => {
  const [schedule, setSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [courseCodes, setCourseCodes] = useState(["COMP2120", "COMP2650", "COMP1410", "MATH1730", "PSYC1160"])
  const [permutationID, setPermutationID] = useState(0)
  const [permutations, setPermutations] = useState([])
  const [earliest, setEarliest] = useState("08:30:00")
  const [latest, setLatest] = useState("22:00:00")
  const state = {
    schedule, setSchedule,
    courses, setCourses,
    courseCodes, setCourseCodes,
    permutationID, setPermutationID,
    permutations, setPermutations,
    earliest, setEarliest,
    latest, setLatest
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
    {/* <div className="flex justify-center items-center absolute h-screen w-screen flex-col">   */}
    <div className="flex justify-center items-center absolute h-screen w-screen flex-col">
    <div className="grid lg:grid-cols-10 sm:grid-cols-5 bg-transparent w-5/6 h-2/3 place-items-stretch gap-4">
        <div className="rounded-lg bg-stone-100 col-span-6">
          <Table schedule={schedule} />
        </div>
        <div className="rounded-lg p-2 bg-stone-100 col-span-2">
          <Controls courseCodes={courseCodes} setCourseCodes={setCourseCodes} permutation={permutationID} setPermutation={setPermutationID} find={find} setEarliest={setEarliest} setLatest={setLatest} state={state}/>
        </div>
        <div className="rounded-lg p-2 bg-stone-100  col-span-2">
          <Finder courseCodes={courseCodes} setCourseCodes={setCourseCodes} />
        </div>
    </div>
    </div>
    <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 to-gray-600 bg-gradient-to-r h-screen w-screen"></div>
    </>
}

export default App;
