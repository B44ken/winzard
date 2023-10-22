package main

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func get_database() *mongo.Database {
	mongo_pass := os.Getenv("MONGO_PASS")

	if mongo_pass == "" {
		fmt.Println("MONGO_PASS environment variable not set")
		os.Exit(1)
	}

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://b44ken:" + mongo_pass + "@winzard.0puyoun.mongodb.net/?retryWrites=true&w=majority").SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	return client.Database("winzard")
}

func get_course_options(db *mongo.Database, code string) []CourseOption {
	var course_options []CourseOption

	collection := db.Collection("course_options_winter2024")
	search, _ := collection.Find(context.Background(), bson.M{"code": code})
	search.All(context.Background(), &course_options)

	return course_options
}

func get_course_details(db *mongo.Database, code string) CourseDetails {
	var course_details CourseDetails

	collection := db.Collection("course_details")
	collection.FindOne(context.Background(), bson.M{"code": code}).Decode(&course_details)

	return course_details
}

func search_course_details(db *mongo.Database, query string) []CourseDetails {
	collection := db.Collection("course_details")

	pipeline := mongo.Pipeline([]bson.D{bson.D{
		{"$search", bson.D{
			{"index", "default"},
			{"text", bson.D{
				{"query", query},
				{"path", bson.D{
					{"wildcard", "*"},
				}},
			}},
		}},
	}})

	cursor, err := collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		panic(err)
	}

	var results []CourseDetails
	cursor.All(context.Background(), &results)
	return results
}
