package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

func HandleOptions(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	response.Header().Set("Access-Control-Allow-Origin", "*")
	code := strings.ToUpper(request.URL.Query().Get("code"))

	if code == "" {
		response.Write([]byte("[]"))
		return
	}

	results := GetCourseOptions(code)
	marshal, err := json.Marshal(results)
	if err != nil {
		response.Write([]byte("[{ error: true }]"))
		return
	}
	if results == nil {
		response.Write([]byte("[]"))
		return
	}

	response.Write(marshal)
}

func HandleDetailsSearch(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")

	search := request.URL.Query().Get("search")
	if search == "" {
		response.Write([]byte("[]"))
		return
	}

	results := SearchCourseDetails(search)
	marshal, err := json.Marshal(results)
	if err != nil {
		response.Write([]byte("[{ error: true }]"))
		return
	}
	if results == nil {
		response.Write([]byte("[]"))
		return
	}
	response.Write(marshal)
}

func StartServer() {
	http.HandleFunc("/details", HandleDetailsSearch)
	http.HandleFunc("/options", HandleOptions)

	http.ListenAndServe(":8790", nil)
}
