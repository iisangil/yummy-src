package restaurant

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
)

// GetRestaurants returns the restaurants
func GetRestaurants(parameters map[string]string) []Business {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.yelp.com/v3/businesses/search", nil)
	if err != nil {
		log.Panic("Error while making new request:", err)
	}
	req.Header.Set("Authorization", "Bearer "+os.Getenv("API_TOKEN"))

	query := req.URL.Query()
	query.Set("latitude", parameters["latitude"])
	query.Set("longitude", parameters["longitude"])

	radius, err := strconv.Atoi(parameters["radius"])
	if err != nil {
		log.Panic("error while converting radius to integer", err)
	}
	query.Set("radius", strconv.Itoa(radius*1609))

	query.Set("limit", "50")
	query.Set("open_now", "true")

	switch parameters["price"] {
	case "4":
		query.Set("price", "1,2,3,4")
	case "3":
		query.Set("price", "1,2,3")
	case "2":
		query.Set("price", "1,2")
	case "1":
		query.Set("price", "1")
	}

	req.URL.RawQuery = query.Encode()

	resp, err := client.Do(req)
	if err != nil {
		log.Panic("Error making request:", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Panic("Error reading response body:", err)
	}

	var yelpResponse Response
	err = json.Unmarshal(body, &yelpResponse)
	if err != nil {
		log.Panic("error unmarshalling response body:", err)
	}

	businesses := yelpResponse.Businesses
	log.Println(businesses)
	return businesses
}
