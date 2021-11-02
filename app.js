//jshint esversion:6

require('dotenv').config()
const express  = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const  app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//mongoDB server 
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//SCHEMA 
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//to get access to the SECRET_VALUE in .env file.
userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});


//MODEL
const User = new mongoose.model("User", userSchema)


//GET request
app.get("/", function(req, res){
    res.render("home")
});

app.get("/login", function(req, res){
    res.render("login")
});

app.get("/register", function(req, res){
    res.render("register")
});

//POST request for register 

app.post("/register", function(req, res){

    const newUser = new User({

        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(!err){
            res.render("Secrets")
        }
        else{
            console.log(err);
        }
    })
});

//POST request for login 

app.post("/login", function(req, res){

    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}, function(err, foundUser){

        if(err){
            res.send(err);
        }
        else{
         if(foundUser){
             if(foundUser.password === password){
                 res.render("Secrets")
             }
         }
        }
    });

});









app.listen(3000, function(req,res){
    console.log("Server runs on port 3000")
});