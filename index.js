const express = require("express");
const cors = require("cors");
const cors_proxy = require('cors-anywhere');
const TorrentIndexer = require('torrent-indexer');
 
const app = express();

const torrentIndexer = new TorrentIndexer();

/*const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 minutes 20 request
  max: 10 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);*/

var allowedOrigins = ['http://localhost:3000',
  'https://ylight.xyz'];

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

const PORT = process.env.PORT || 5000;

app.get("/movie", async (req, res) => {
  const torrents = await torrentIndexer.search(req.query.name, req.query.type, 4);
  res.json(torrents);
})




let proxy = cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeaders: [], // Do not require any headers.
  removeHeaders: [] // Do not remove any headers.
});

 


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));
