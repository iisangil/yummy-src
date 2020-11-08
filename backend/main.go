package main

import (
	"context"
	"encoding/json"
	"endpoint"
	"fmt"
	"log"
	"main/endpoint"
	"net/http"
	"os"
	"time"

	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"github.com/naguigui/yelp-fusion/yelp"
)

var client *mongo.Client
var yelpClient *yelp.Client
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
	GroupID string   `json:"groupid"`
	Users   []string `json:"users"`
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
	mux.HandleFunc("/join", joinGroup)
	// mux.HandleFunc("/leave", leaveGroup)
	mux.HandleFunc("/get", getRestaurants)

	handler := cors.Default().Handler(mux)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func login(w http.ResponseWriter, r *http.Request) {
	// login with phone number
	if r.Method != "POST" {
		http.Error(w, "Invalid Method", 405)
		return
	}
	r.ParseForm()
	if r.FormValue("self") == "" {
		http.Error(w, "Invalid Parameters", http.StatusBadRequest)
	}
	self = r.FormValue("self")
	fmt.Println("Self is ", self)

	var u User
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// add user to database
	collection := client.Database("yummyDb").Collection("users")
	_, err = collection.InsertOne(context.Background(), u)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted user!")

	var re Response
	re.Message = "success"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(re)
}

func updateUser() {
	collection := client.Database("yummyDb").Collection("users")
	_, err := collection.UpdateOne(
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
	fmt.Println("Updated user!")
}

func createGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid Method", 405)
		return
	}
	r.ParseForm()
	if r.FormValue("self") == "" {
		http.Error(w, "Invalid Parameters", http.StatusBadRequest)
	}
	self = r.FormValue("self")
	fmt.Println("Self is ", self)

	var g Group
	err := json.NewDecoder(r.Body).Decode(&g)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(g)

	group = g.GroupID
	if group == "" {
		http.Error(w, "Invalid Form", http.StatusBadRequest)
		return
	}

	collection := client.Database("yummyDb").Collection("groups")
	_, err = collection.InsertOne(context.Background(), g)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted group!")

	updateUser()

	var re Response
	re.Message = "success"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(re)
}

func joinGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid Method", 405)
		return
	}
	r.ParseForm()
	if r.FormValue("self") == "" {
		http.Error(w, "Invalid Parameters", http.StatusBadRequest)
	}
	self = r.FormValue("self")
	fmt.Println("Self is ", self)

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
	_, err = collection.UpdateOne(
		context.Background(),
		bson.D{
			primitive.E{Key: "groupid", Value: group},
		},
		bson.D{
			primitive.E{Key: "$push", Value: bson.D{
				primitive.E{Key: "users", Value: self},
			}},
		},
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Updated group!")

	updateUser()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g)
}

/**
func leaveGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid Method", 405)
		return
	}
	// leave the group in database
	var g Group
	err := json.NewDecoder(r.Body).Decode(&g)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	self = g.Self
	group = ""
	g.GroupID = ""
	for i, v := range g.Users {
		if v.UserID == self {
			g.Users[len(g.Users)-1], g.Users[i] = g.Users[i], g.Users[len(g.Users)-1]
			break
		}
	}
	g.Users = g.Users[:len(g.Users)-1]

	collection := client.Database("yummyDb").Collection("groups")
	_, err = collection.UpdateOne(
		context.Background(),
		bson.D{
			primitive.E{Key: "groupid", Value: group},
		},
		bson.D{
			primitive.E{Key: "$pull", Value: bson.D{
				primitive.E{Key: "users", Value: self},
			}},
		},
	)
	fmt.Println("Left Group!")

	collection = client.Database("yummyDb").Collection("users")
	_, err = collection.UpdateOne(
		context.Background(),
		bson.D{
			primitive.E{Key: "userid", Value: self},
		},
		bson.D{
			primitive.E{Key: "$set", Value: bson.D{
				primitive.E{Key: "group", Value: ""},
			}},
		},
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Updated user!")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g)
}
**/

func getRestaurants(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid Method", 405)
		return
	}
	if yelpClient == nil {
		var err error
		yelpClient, err = yelp.Init(&yelp.ClientOptions{APIKey: os.Getenv("YELP_API_KEY")})
		if err != nil {
			log.Fatal(err)
		}
	}
	// params := r.URL.RawQuery
	r.ParseForm()

	delivery := false
	if r.FormValue("delivery") != "" {
		delivery = true
	}
	location := "715 Church St #4 Ann Arbor, MI 48104"
	if r.FormValue("location") == "" {
		http.Error(w, "Invalid Parameters", http.StatusBadRequest)
	}
	// location := r.FormValue("location")
	radius := "10"
	if r.FormValue("radius") != "" {
		radius = int(r.FormValue("radius"))
	}
	limit := 10
	price := ""
	if r.FormValue("price") != "" {
		price := int(r.FormValue("price"))
	}
	var params map[string]string {

	}

	endpoint.GetRestaurants(params)
}
