package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var client *mongo.Client
var self string

// change the functions to handle different endpoints and methods
func apiResponse(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message":"hello world!"}`))
}

// Post is for testing insertion into database
type Post struct {
	title string `json:”title,omitempty”` // idk why this has warning
	body  string `json:”body,omitempty”`
}

// insert a test data thing into the test collection
func insertTest(title string, body string) {
	fmt.Println("func start")
	post := Post{"hello", "goodbye"}
	collection := client.Database("yummyDb").Collection("tests")
	fmt.Println("got database collection")
	insertResult, err := collection.InsertOne(context.TODO(), post)
	fmt.Println("inserted")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted post with ID:", insertResult.InsertedID)
}

func main() {
	// taken from https://docs.mongodb.com/drivers/go
	// Replace the uri string with your MongoDB deployment's connection string.
	uri := "mongodb+srv://dbUser:dbUserPassword@cluster0.htrlj.mongodb.net/yummyDb?retryWrites=true&w=majority"
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	// Ping the primary
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		panic(err)
	}
	fmt.Println("Successfully connected and pinged.")

	// insertTest("hello", "goodbye")

	http.HandleFunc("/login", login)
	http.HandleFunc("/create", createGroup)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func login(w http.ResponseWriter, r *http.Request) {
	// login with phone number
}

func createGroup(w http.ResponseWriter, r *http.Request) {
	// implement this part
}
