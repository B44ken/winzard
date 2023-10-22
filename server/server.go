package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

func handle_options(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	code := strings.ToUpper(request.URL.Query().Get("code"))

	if code == "" {
		response.Write([]byte("[]"))
		return
	}

	results := get_course_options(code)
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

func handle_details_search(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")

	search := request.URL.Query().Get("search")
	if search == "" {
		response.Write([]byte("[]"))
		return
	}

	results := search_course_details(search)
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

func start_server() {
	http.HandleFunc("/details", handle_details_search)
	http.HandleFunc("/options", handle_options)

	http.ListenAndServe(":8790", nil)
}
