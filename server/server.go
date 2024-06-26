package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

func HandleOptions(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	response.Header().Set("Access-Control-Allow-Origin", "*")

	code := strings.ToUpper(request.URL.Query().Get("code"))
	calendar := strings.ToLower(request.URL.Query().Get("calendar"))

	if code == "" || calendar == "" {
		response.Write([]byte("[{ \"error\": \"No course code or calendar provided\" }]"))
		return
	}

	results := GetCourseOptions(code, calendar)
	marshal, err := json.Marshal(results)
	if err != nil {
		response.Write([]byte("[{ \"error\": \"Could not marshal response\" }]"))
		return
	}
	if results == nil {
		response.Write([]byte("[{ \"error\": \"No results found\"}]"))
		return
	}

	response.Write(marshal)
}

func HandleDetailsSearch(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	response.Header().Set("Access-Control-Allow-Origin", "*")

	search := request.URL.Query().Get("search")
	if search == "" {
		response.Write([]byte("[{ error: true, message: \"No search term provided\" }]"))
		return
	}

	results := SearchCourseDetails(search)
	marshal, err := json.Marshal(results)
	if err != nil {
		response.Write([]byte("[{ error: true, message: \"Could not marshal response\" }]"))
		return
	}
	if results == nil {
		response.Write([]byte("[]"))
		return
	}
	response.Write(marshal)
}

func StartServer() {
	root := os.Getenv("SERVER_ROOT") // conveniently defaults to empty string
	fmt.Println("server up (root " + root + ", port 8790)")

	http.HandleFunc(root+"/details", HandleDetailsSearch)
	http.HandleFunc(root+"/options", HandleOptions)

	err := http.ListenAndServe(":8790", nil)
	if err != nil {
		panic(err)
	}
}
