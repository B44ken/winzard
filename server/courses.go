package main

type CourseOption struct {
	ID        string
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

// {
// 	"_id": { "$oid": "65347177e70bb19f7502e4b1" },
// 	"prerequisites": [
// 	  "Restricted to students registered in programs offered wholly or jointly by Computer Science or by Mathematics and Statistics, or with approval of Computer Science"
// 	],
// 	"labHours": { "$numberDouble": "1.5" },
// 	"lectureHours": { "$numberDouble": "3" },
// 	"courseCode": "COMP-1000",
// 	"courseName": "Key Concepts in Computer Science",
// 	"corequisites": [],
// 	"specialNotes": ""
//   }

type CourseDetails struct {
	ID string

	Prerequisites []string
	Corequisites  []string

	LabHours     float64
	LectureHours float64

	CourseCode string
	CourseName string

	SpecialNotes string
}
