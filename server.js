const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const Tesseract = require("tesseract.js");
const mongoose = require("mongoose");

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: false}));

const PORT = 5000 || process.env.PORT;

var Storage = multer.diskStorage({
    destination: (req, res, callback)=>{
        callback(null, __dirname + "/images");   
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

var upload = multer ({
    storage: Storage
}).single("image1");

//routes

app.post("/upload", (req, res) => {
    console.log(req.file);
    
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.send("Oops! Let's do it again")
        }
            return res.send("Uploaded!");
    });
});

var image1 = fs.readFileSync(__dirname + '/images/ocr wiki.png', {encoding: null});
console.log(image1);

Tesseract.recognize(image1, "eng").then((output) => {
    console.log(output);

//connection Database 
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://abc123:Test12345@mydb-fluxr.mongodb.net/MyDB";
//connect to the mongo client
const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true });

client.connect(err => {
    const collection = 
    client.db("test").collection("Content");
    console.log("connected!");
    
//insert one input    
    collection.insertOne(output, function(err, res) {
    console.log("data inserted!");
    });
    client.close();
});
});
//Server starts
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
