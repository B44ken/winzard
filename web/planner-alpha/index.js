let courseDatabase = {}
fetch('calendar.json').then(response => response.json()).then(data => courseDatabase = data)

const coursePlan = []
for (let i = 0; i < 8; i++) {
	coursePlan.push([])
}

const classTemplate = document.querySelector(".class-template").innerHTML;

const courseTable = document.querySelector(".course-plan");

const clearCourseTable = () => {
	const items = document.querySelectorAll(".class");
	for (const i of Array.from(items)) {
		i.innerHTML = "";
	}
};

const errors = document.querySelector('.errors')

const populateCoursePlan = () => {
	errors.innerHTML = ""
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

	for(const course of coursePlan.flat()) {
		if(!verifyCourse(course)) {
			errors.innerHTML += `<br>${course} sequence error`
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

const verifyCourse = (course, maxSemester = Infinity) => {
	// prerequisite match
	let prerequisites = courseDatabase.find((c) => c.courseCode == course)?.prerequisites;
	let corequisites = courseDatabase.find((c) => c.courseCode == course)?.corequisites;

	if (prerequisites == undefined) prerequisites = [];
	if (corequisites == undefined) corequisites = [];

	prerequisites = prerequisites.filter((P) => P.includes("-"));
	corequisites = corequisites.filter((P) => P.includes("-"));

	const taken = []
	let takenNow = []
	for (let semester in coursePlan) {
		if(coursePlan[semester].includes(course) || semester >= maxSemester) {
			takenNow = coursePlan[semester]
			break
		}
		else taken.push(...coursePlan[semester])
	}

	takenNow = takenNow.concat(taken)

	for (let P of prerequisites) {
		let hasAny = false;
		// split on "or" or ","
		P = P.split(" or ");
		for (let P2 of P) {
			P2 = P2.trim();
			if (taken.includes(P2)) hasAny = true;
		}
		if (!hasAny) return false;
	}

	for(let C of corequisites) {
		let hasAny = false;
		C = C.split(" or ");
		for (let C2 of C) {
			C2 = C2.trim();
			if (takenNow.includes(C2)) hasAny = true;
		}
		if (!hasAny) return false;
	}

	return true;
}

const addToPlan = (course, overload = false, fillPrereq = true) => {
	if(coursePlan.flat().includes(course)) return false
	
	prerequisites = courseDatabase.find((c) => c.courseCode == course)
		?.prerequisites
		.filter((P) => P.includes("-"))

	if(prerequisites == undefined) prerequisites = []

	for(let semester = 0; semester < coursePlan.length; semester++) {
		if(verifyCourse(course, semester) && coursePlan[semester].length < (overload ? 5 : 6)) {
			coursePlan[semester].push(course)
			populateCoursePlan()
			return
		} else if (fillPrereq) {
			for(P of prerequisites) {
				P0 = P.split(" or ")[0].trim()
				console.log(P0)
				addToPlan(P0, true, true)
			}
		}
	}
	if(fillPrereq) {
		addToPlan(course, false, false)
	}
};

const searchBox = document.querySelector('.search')
searchBox.addEventListener('keydown', event => {
	if(event.key == 'Enter') {
		let entry = searchBox.textContent
		let code = entry.slice(0, 4).toUpperCase() + "-" + entry.slice(-4)
		addToPlan(code)

		setTimeout(() => searchBox.textContent = "", 1)
	}
})

const countSemesters = (year = 2023, now = "Fall", total = 8, includeSummer = false) => {
	let semesters = ["Winter", "Fall"]
	if(includeSummer)
		semesters = ["Winter", "Summer", "Fall"]
	const current = semesters.indexOf(now)
	let names = []
	for(let i = 0; i < 8; i++) {
		let S = semesters[(i + current) % semesters.length]
		if(S == "Winter") year++
		names.push(S + " " + year)
	}
	return names
}

const headers = document.querySelectorAll('.semester > .header')
countSemesters().forEach((S, i) => {
	headers[i].innerHTML = `<div class="header-label">${S}</div>`
})