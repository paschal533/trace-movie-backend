const express = require('express');
const Movie = require('./Movie');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

router.use(methodOverride('_method'));

const mongoURI = 'mongodb+srv://paschal:84316860p@cluster0.v0kgk.mongodb.net/traceDB?retryWrites=true&w=majority';

const conn = mongoose.createConnection(mongoURI);
let gfs;

conn.once('open', () => {
    // init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('upcoming');
})

// create storage engine 
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'upcoming'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

router.post('/add', upload.single('img'), async ( req, res)=>{
    console.log(req.body.name);
    const movie = new Movie({
      name: req.body.name,
      type: req.body.type
    });

    try{
        const newMovie = await movie.save();
        console.log(newMovie);  
        res.redirect('/')  ;
      }catch (err){
        console.log(err);    
      }
  });


module.exports = router;