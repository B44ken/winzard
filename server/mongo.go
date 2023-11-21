package main

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db *mongo.Database

func DatabaseConnect() *mongo.Database {
	mongo_pass := os.Getenv("MONGO_PASS")

	if mongo_pass == "" {
		fmt.Println("MONGO_PASS environment variable not set")
		os.Exit(1)
	}

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://client:" + mongo_pass + "@winzard.dnvuply.mongodb.net/?retryWrites=true&w=majority").SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	db = client.Database("winzard")
	fmt.Println("connected to mongodb")
	return db
}

func GetCourseOptions(code string) []CourseOption {
	var course_options []CourseOption

	collection := db.Collection("course_options_winter2024")
	search, err := collection.Find(context.Background(), bson.M{"code": code})
	if err != nil {
		panic(err)
	}

	search.All(context.Background(), &course_options)

	return course_options
}

func GetCourseDetails(code string) CourseDetails {
	var course_details CourseDetails

	collection := db.Collection("course_details")
	collection.FindOne(context.Background(), bson.M{"code": code}).Decode(&course_details)

	return course_details
}

func SearchCourseDetails(query string) []CourseDetails {
	collection := db.Collection("course_details")

	searchPipeline := mongo.Pipeline{bson.D{{"$search", bson.D{
		{"text", bson.D{
			{"path", bson.D{{"wildcard", "*"}}},
			{"query", query},
		}}}}}}

	cursor, err := collection.Aggregate(context.Background(), searchPipeline)
	if err != nil {
		panic(err)
	}

	var results []CourseDetails
	cursor.All(context.TODO(), &results)

	return results
}
