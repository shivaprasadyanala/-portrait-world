const express = require('express')
const multer = require('multer')
var bodyParser = require('body-parser');
var Image = require('./models/imageModel')
const bb = require('express-busboy');
const mongoose = require('mongoose');
const { find } = require('./models/imageModel');
const ejs = require("ejs");
path = require('path')
var app = express();
bb.extend(app, {
    upload: true,
    path: '/path/to/save/files',
    allowedPath: /./
});
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//rendering template
// app.set("views", path.join(__dirname, "./models/views"))
app.set('view engine', 'ejs');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: fileFilter
})


//get image
app.get('/', async(req, res) => {
    res.render('pages/index')
})
app.get("/images", async(req, res) => {

        const images = await Image.find();
        // console.log(images);
        res.render('pages/images', {
                images: images
            })
            // res.status(200).send(images)
    })
    //get image by id
app.get("/image/:id", async(req, res) => {
    const image = await Image.findById(req.params.id);
    if (!image)
        res.status(200).send("image not availble");
    else
        res.status(200).send(image)
})


app.get("/upload", (req, res) => {
        res.render('pages/upload')
    })
    //post image 
app.post("/upload", upload.single('myImage'), (req, res, next) => {
        console.log(req.body);
        console.log(req.body.title);
        console.log(req.file);
        const image = new Image({
                title: req.body.title,
                content: req.body.content,
                heading: req.body.heading,
                imageUrl: req.file.path
            }

        )
        image.save()
            .then(result => {
                res.status(201).json(result);
            })
    })
    //edit image 
app.put("/edit/:id", upload.single('myImage'), (req, res, next) => {
        // console.log(req.file);
        const cimage = Image.findById(req.params.id);
        // console.log(cimage.obj);
        cimage.updateOne({
                title: req.body.title,
                content: req.body.content,
                heading: req.body.heading,
                imageUrl: req.file.path
            })
            .then(result => {
                res.status(201).json(result);
            })
    })
    //delete product
app.delete("/delete/:id", async(req, res, next) => {
        console.log(req.body.title);
        const cimage = Image.findById(req.params.id);
        if (cimage) {
            await cimage.deleteOne();
            res.status(201).send("image got deleted")
        }

    })
    // res.send({ title: title, content: content, heading: heading, image: imageUrl })


mongoose.connect("mongodb://localhost:27017/image")
    .then(() => {
        app.listen(4000, () => {

            console.log("server is listening on port 4000");
        })
    })
    .catch((err) => {
        console.log("Error Occured");
    })