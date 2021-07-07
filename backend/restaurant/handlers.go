package restaurant

import (
	"encoding/json"
	"fmt"
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

	fmt.Println("parameter price", parameters["price"])

	price := parameters["price"]
	if price == "" {
		fmt.Println("price == nothing")
		price = "1,2,3,4"
	}
	if price[len(price)-1] == ',' {
		price = price[:len(price)-1]
		fmt.Println("set price to", price)
	}
	query.Set("price", price)

	fmt.Println("price", price)

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
	fmt.Printf("%+v\n", yelpResponse)

	for i := 0; i < len(yelpResponse.Businesses); i++ {
		fmt.Println("restaurant:", yelpResponse.Businesses[i])
	}

	businesses := yelpResponse.Businesses
	return businesses
}
