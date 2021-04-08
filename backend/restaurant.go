package main

// add functions and structs and whatnot related to restaurants here
// yelp api

// Cattegory object
type Category struct {
	Alias string `json:"alias"` // Alias of a category, when searching for business in certain categories, use alias rather than the title.
	Title string `json:"title"` // Title of a category for display purpose.
}

// Coordinates object
type Coordinates struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// Location object
type Location struct {
	Address1       string   `json:"addreses1"`
	Address2       string   `json:"address2"`
	Address3       string   `json:"address3"`
	City           string   `json:"city"`
	Country        string   `json:"country"`
	DisplayAddress []string `json:"display_address"` // Array of strings that if organized vertically give an address that is in the standard address format for the business's country.
	State          string   `json:"state"`
	ZipCode        string   `json:"zip_code"`
}

// Business object
type Business struct {
	Categories   []Category  `json:"categories"`
	Coordinates  Coordinates `json:"coordinates"`
	DisplayPhone string      `json:"display_phone"` // already formatted
	Distance     float64     `json:"distance"`      // in meters
	ID           string      `json:"id"`            // yelp id
	Alias        string      `json:"alias"`         // yelp alias
	ImageURL     string      `json"image_url"`
	IsClosed     bool        `json:"is_closed"` // whether business has been permanently closed
	Location     []Location  `json:"location"`
	Name         string      `json:"name"`
	Phone        string      `json:"phone"`
	Price        string      `json:"price"`  // Price level of the business. Value is one of $, $$, $$$ and $$$$.
	Rating       float64     `json:"rating"` // 1-5
	ReviewCount  int         `json:"review_count"`
	URL          string      `json:"url"`          // url for business page on yelp
	Transactions []string    `json:"transactions"` // List of Yelp transactions that the business is registered for. Current supported values are pickup, delivery and restaurant_reservation.
}

// Region object
type Region struct {
	Center Coordinates `json:"center"`
}

// Response object for GET https://api.yelp.com/v3/businesses/search
type Response struct {
	Total      int        `json:"total"`
	Businesses []Business `json:"businesses"`
	Region     Region     `json:"region"`
}
