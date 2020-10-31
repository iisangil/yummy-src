package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var client *mongo.Client
var self string

// Post is for testing insertion into database
type Post struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

// Response is for api endpoint responses
type Response struct {
	Message string `json:"message"`
}

// User is for users in database
type User struct {
	ID    string `json:"id"`
	Group string `json:"group"`
}

func main() {
	// taken from https://docs.mongodb.com/drivers/go
	uri := "mongodb://dbUser:dbUserPassword@cluster0-shard-00-00.htrlj.mongodb.net:27017,cluster0-shard-00-01.htrlj.mongodb.net:27017,cluster0-shard-00-02.htrlj.mongodb.net:27017/yummyDb?ssl=true&replicaSet=atlas-1lw2jg-shard-0&authSource=admin&retryWrites=true&w=majority"
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

	http.HandleFunc("/login", login)
	http.HandleFunc("/create", createGroup)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// insert a test data thing into the test collection
func insertTest(title string, body string) {
	post := Post{"hello", "goodbye"}
	collection := client.Database("yummyDb").Collection("tests")
	insertResult, err := collection.InsertOne(context.TODO(), post)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted post with ID:", insertResult.InsertedID)
}

func getTest() {
	collection := client.Database("yummyDb").Collection("tests")
	filter := bson.D{}
	var post Post
	err := collection.FindOne(context.TODO(), filter).Decode(&post)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Found post with title ", post.Title)
}

func login(w http.ResponseWriter, r *http.Request) {
	// login with phone number
	if r.Method != "POST" {
		http.Error(w, "This is the login page.", 405)
		return
	}
	if err := r.ParseForm(); err != nil {
		response := Response{"Invalid form."}
		json.NewEncoder(w).Encode(response)
		return
	}
	self = r.FormValue("phone")
	// add user to database
	user := User{self, ""}
	collection := client.Database("yummyDb").Collection("users")
	insertResult, err := collection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted user with ID:", insertResult.InsertedID)

	json.NewEncoder(w).Encode(user)
}

func createGroup(w http.ResponseWriter, r *http.Request) {
	// implement this part

}
