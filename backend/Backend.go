package main

import (
	"fmt"
	"strconv"
	"time"

	"github.com/go-martini/martini"
	"github.com/jinzhu/gorm"                   // ORM package for Go
	_ "github.com/jinzhu/gorm/dialects/sqlite" // for SQLite. Only imports functions so that ORM can use. Hence the '_'
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/cors"
	"github.com/martini-contrib/render"
	_ "github.com/mattn/go-sqlite3"
)

var db *gorm.DB

// Base Model's definition
type Game struct {
	ID        uint   `gorm:"primary_key" gorm:"AUTO_INCREMENT"`
	Address   string `form:"address" binding:"required"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func main() {
	var err error
	db, err = gorm.Open("sqlite3", "./Game.db")
	if err != nil {
		fmt.Println("Unable to read DB")
		return
	}
	defer db.Close()
	db.AutoMigrate(&Game{})
	db.LogMode(true)
	db.Exec("PRAGMA foreign_keys = ON")
	m := martini.Classic()
	m.Use(cors.Allow(&cors.Options{
		AllowCredentials: true,
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST", "GET"},
	}))
	m.Use(render.Renderer(render.Options{
		IndentJSON: true, //For testing API
	}))
	m.Get("/list", func(r render.Render) {
		var genres []Game
		err := db.Find(&genres).Error
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(genres)
		r.JSON(200, map[string]interface{}{"status": "SUCCESS", "message": "Successfully fetched all games", "games": genres})
	})
	m.Get("/add", binding.Bind(Game{}), func(game Game, r render.Render) {
		quiz := Game{}
		quiz.Address = game.Address
		fmt.Println(quiz)
		err2 := db.Create(&quiz).Error
		if err2 != nil {
			r.JSON(200, map[string]interface{}{"status": "FAILURE", "message": "Unable to Create Quiz"})
			return
		}
		r.JSON(200, map[string]interface{}{"status": "SUCCESS", "message": "Game Added Successfully", "id": quiz.ID})
	})
	m.Get("/delete/:id", func(params martini.Params, r render.Render) {
		id, err := strconv.Atoi(params["id"])
		if err != nil {
			r.JSON(200, map[string]interface{}{"status": "FAILURE", "message": "Invalid Game ID"})
			return
		}
		genre := Game{}
		err2 := db.First(&genre, id).Error
		if err2 != nil {
			fmt.Println(err2)
		}
		db.Delete(&genre)
		r.JSON(200, map[string]interface{}{"status": "SUCCESS", "message": "Game Deleted Successfully"})
	})
	m.Run()
}
