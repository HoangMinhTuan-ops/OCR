const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const Tesseract = require("tesseract.js");

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

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

Tesseract.recognize(image1, "eng").then((result) => {
    console.log(result);
    
});

//Server starts


app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
