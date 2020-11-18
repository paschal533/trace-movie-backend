const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const xtorrent = require('xtorrent');
const postsRoute = require('./Routes/Post');


const app = express();



var allowedOrigins = ['http://localhost:3000',
  'https://paschal533.github.io/tracemovies','https://paschal533.github.io'];

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

app.use('/post', postsRoute);
app.use(bodyParser.json());

//connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to db')
}
)

const PORT = process.env.PORT || 5000;

 
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
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));
