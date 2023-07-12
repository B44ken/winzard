let courseDatabase = {}
fetch('gpt-calendar-combined.json').then(response => response.json()).then(data => courseDatabase = data)

const coursePlan = [[], [], [], [], [], []]

const classTemplate = document.querySelector(".class-template").innerHTML;

const courseTable = document.querySelector(".course-plan");

const clearCourseTable = () => {
	const items = document.querySelectorAll(".class");
	for (const i of Array.from(items)) {
		i.innerHTML = "";
	}
};

const populateCoursePlan = () => {
	clearCourseTable();

	for (const semester in coursePlan) {
		for (let course in coursePlan[semester]) {
			course = Number(course);
			const courseElement = courseTable.children[semester].children[course + 1];
			courseElement.innerHTML = classTemplate.replace(
				"CLASS",
				coursePlan[semester][course]
			);
		}
	}
};

populateCoursePlan(coursePlan);

const moveClass = (element, shift) => {
	const name = element.parentElement.parentElement.children[0].textContent;
	for (let semester in coursePlan) {
		semester = Number(semester);
		if (coursePlan[semester].includes(name)) {
			coursePlan[semester] = coursePlan[semester].filter((c) => c != name).sort();

			if(semester + shift < 0) break

			if (coursePlan[semester + shift] == undefined)
				coursePlan[semester + shift] = [];
			coursePlan[semester + shift].unshift(name);
			break;
		}
	}
	populateCoursePlan();
};

const addToPlan = (course, overload = false, fillPrereq = true) => {
	if(coursePlan.flat().includes(course)) return false
	
	let maxCourses = 5;
	let prerequisites = courseDatabase.find(
		(c) => c.courseCode == course
	)?.prerequisites

	if(prerequisites?.join("").toLowerCase().includes("grade 12")) prerequisites = []
	
	if(prerequisites == null) prerequisites = []

	
	prerequisites = prerequisites.filter(P => 
		P.includes('-') // hacky way to filter out non-courses
	)

	if (overload) maxCourses++;

	for (let semester in coursePlan) {
		semester = Number(semester);
		if (semester > 0) {
			prerequisites = prerequisites.filter((P) => {
				for(let P2 of P.split("or")) {
					P2 = P2.trim()
					 if(coursePlan[semester - 1].includes(P2)) return false
				}
				return true
			})
		}
		if (coursePlan[semester].length < maxCourses && prerequisites.length == 0) {
			coursePlan[semester].push(course);
			populateCoursePlan();
			return;
		}
	}
	if (!overload) addToPlan(course, true, fillPrereq);
	if(fillPrereq) {
		for(const P of prerequisites) {
			let hasAny = false
			for(const P2 of P.split(" or ")) {
				console.log(P2)
				if(coursePlan.flat().includes(P2)) hasAny = true
			}
			if(!hasAny) {
				addToPlan(P.split(" or ")[0], false, false)
			}
			addToPlan(course, false, false)
		}
	}
	return true
};

const searchBox = document.querySelector('.search')
searchBox.addEventListener('keydown', event => {
	if(event.key == 'Enter') {
		addToPlan(searchBox.textContent.toUpperCase())
		setTimeout(() => searchBox.textContent = "", 1)
	}
})

setTimeout(() => {
	addToPlan("MATH-1720")
	addToPlan("MATH-1730")
}, 1000)