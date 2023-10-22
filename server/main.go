package main

import "fmt"

func main() {
	db := get_database()
	searches := search_course_details(db, "Concepts in CS")
	fmt.Println(searches[0].CourseCode)
	fmt.Println(searches[0].CourseName)
}
