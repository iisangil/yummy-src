package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var client *mongo.Client
var self string
var group string

// Response is for api endpoint responses
type Response struct {
	Message string `json:"message"`
}

// User is for users in database
type User struct {
	UserID string `json:"userid"`
	Group  string `json:"groupid"`
}

// Group is for groups in database
type Group struct {
	GroupID string `json:"groupid"`
	Users   []User `json:"users"`
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

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("{\"hello\": \"world\"}"))
	})
	mux.HandleFunc("/login", login)
	mux.HandleFunc("/create", createGroup)

	handler := cors.Default().Handler(mux)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func getTest() {
	// collection := client.Database("yummyDb").Collection("tests")
	// filter := bson.D{}
	// var post Post
	// err := collection.FindOne(context.TODO(), filter).Decode(&post)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Println("Found post with title ", post.Title)
}

func login(w http.ResponseWriter, r *http.Request) {
	// login with phone number
	if r.Method != "POST" {
		http.Error(w, "Invalid Method", 405)
		return
	}
	var u User
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	self = u.UserID
	if self == "" {
		http.Error(w, "Invalid Form", http.StatusBadRequest)
		return
	}
	// add user to database
	collection := client.Database("yummyDb").Collection("users")
	insertResult, err := collection.InsertOne(context.TODO(), u)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted user with ID:", insertResult.InsertedID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(u)
}

func createGroup(w http.ResponseWriter, r *http.Request) {
	// implement this part
	if r.Method != "POST" {
		http.Error(w, "Invalid Method", 405)
		return
	}
	var g Group
	err := json.NewDecoder(r.Body).Decode(&g)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	group = g.GroupID
	if group == "" {
		http.Error(w, "Invalid Form", http.StatusBadRequest)
		return
	}

	collection := client.Database("yummyDb").Collection("groups")
	insertResult, err := collection.InsertOne(context.TODO(), g)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted group with ID:", insertResult.InsertedID)

	collection = client.Database("yummyDb").Collection("users")
	updateResult, err := collection.UpdateOne(
		context.Background(),
		bson.D{
			primitive.E{Key: "userid", Value: self},
		},
		bson.D{
			primitive.E{Key: "$set", Value: bson.D{
				primitive.E{Key: "group", Value: group},
			}},
		},
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Updated user with ID:", updateResult.UpsertedID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g)
}
