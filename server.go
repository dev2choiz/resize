package main

import (
	"log"
	"net/http"
)

func main() {
	p := ":8080"
	log.Println("Listen", p)
	err := http.ListenAndServe(p, http.FileServer(http.Dir(".")))
	if err != nil {
		panic(err)
	}
}
