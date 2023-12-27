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

  const background = <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 to-gray-600 bg-gradient-to-r h-screen w-screen fixed"></div>

  // responsive would be nice
  if(window.innerWidth <= 700) return <>
    {background}
    <div className="mx-auto w-full p-4 absolute">
      <div className="w-full overflow-x-scroll rounded-lg my-4 bg-stone-100">
        <div className="" style={{width: 850}}>
          <Table schedule={schedule} />
        </div>
      </div>
      <div className="rounded-lg my-4 p-4 bg-stone-100 h-1/2" style={{height: 400}}>
        <Controls state={state} find={find}/>
      </div>
      <div className="rounded-lg my-4 p-4 bg-stone-100" style={{height: 400}}>
        <Finder courseCodes={courseCodes} setCourseCodes={setCourseCodes} />
      </div>
    </div>
  </>
  else return <>
    {background}
    <div className="flex justify-center items-center absolute h-screen w-screen flex-col">
      <div className="grid grid-cols-10 w-5/6 h-2/3 place-items-stretch gap-4">
          <div className="rounded-lg bg-stone-100 col-span-6 h-full">
            <Table schedule={schedule} />
          </div>
          <div className="rounded-lg p-2 bg-stone-100 col-span-2">
            <Controls state={state} find={find}/>
          </div>
          <div className="rounded-lg p-2 bg-stone-100 col-span-2">
            <Finder courseCodes={courseCodes} setCourseCodes={setCourseCodes} />
          </div>
      </div>
    </div>
    </>
}

export default App;
