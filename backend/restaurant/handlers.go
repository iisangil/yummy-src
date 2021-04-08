package restaurant

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
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
	query.Set("latitude", "37.786882")
	query.Set("longitude", "-122.399972")

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

	log.Println(fmt.Sprintf("RESPONSE: %+v", yelpResponse))

	thing := make([]Business, 0)
	return thing
}
