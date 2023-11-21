package main

type CourseOption struct {
	Code      string
	Dates     []string
	LabExists bool
	Times     struct {
		Lecture struct {
			Days  []string
			Hours []string
		}
		Lab struct {
			Days  []string
			Hours []string
		}
	}
	Room struct {
		Lecture string
		Lab     string
	}
	Instructor struct {
		Lecture string
		Lab     string
	}
	Seats struct {
		Lecture []int
		Lab     []int
	}
}

type CourseDetails struct {
	Prerequisites  []string
	Corequisites   []string
	AntiRequisites []string

	LabHours     float64
	LectureHours float64

	Code string
	Name string

	Notes string
}
