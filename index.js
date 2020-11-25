const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const xtorrent = require('xtorrent');
const postsRoute = require('./Routes/Post');
const expressLayouts = require('express-ejs-layouts');
const Movie = require('./Models/Movie');
//const upComing = require('./Routes/Upcoming');


const app = express();

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];


var allowedOrigins = ['http://localhost:3000',
  'https://paschal533.github.io/tracemovies','https://paschal533.github.io','http://localhost:5000'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.options("*", cors());
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

//connect to db
mongoose.connect('mongodb+srv://paschal:84316860p@cluster0.v0kgk.mongodb.net/traceDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to db')
}
)

app.use('/post', postsRoute);
//app.use('/upload', upComing);

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  try{
    const movie  = await Movie.find();
    res.render("index", {
      movie
    });
  }catch (err){
    console.log("err: "+ err); 
  }
});

app.get("/movie", async (req, res) => {
  xtorrent.search({query: req.query.name , category: req.query.type}).then(data => {
  res.json(data);
  });
})

app.get("/download", async (req, res) => {
  xtorrent
  .info(
    `https://1337x.to/${req.query.torrent}/${req.query.movieId}/${req.query.movieName}/`
  ).then(data => {
  res.json(data);
  });
});

app.post('/add', async ( req, res, next)=>{
  const {name, type, img, description, date} = req.body;
  const movie = new Movie({
    name,
    type,
    description,
    date
  });

  // SETTING IMAGE AND IMAGE TYPES
  saveImage(movie, img);
  try{
    const newMovie = await movie.save();
    console.log(newMovie);  
    res.redirect('/')  ;
  }catch (err){
    console.log(err);    
  }
});




function saveImage(movie, imgEncoded) {
  // CHECKING FOR IMAGE IS ALREADY ENCODED OR NOT
  if (imgEncoded == null) return;

  // ENCODING IMAGE BY JSON PARSE
  // The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string
  const img = JSON.parse(imgEncoded);
  console.log( "JSON parse: "+ img);
  
  // CHECKING FOR JSON ENCODED IMAGE NOT NULL 
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  // AND HAVE VALID IMAGE TYPES WITH IMAGE MIME TYPES
  if (img != null && imageMimeTypes.includes(img.type)) {

    // https://nodejs.org/api/buffer.html
    // The Buffer class in Node.js is designed to handle raw binary data. 
    // SETTING IMAGE AS BINARY DATA
    movie.img = new Buffer.from(img.data, "base64");
    movie.imgType = img.type;
  }
}

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));
