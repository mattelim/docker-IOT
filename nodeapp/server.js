var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json() );  
app.use(bodyParser.urlencoded({extended: true}));

const cors = require("cors"); // Cors
const whitelist = ['http://localhost:3000', 'http://localhost:1880', 'http://localhost:8081'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));

var port = process.env.PORT || 8081;

app.get('/getData', function(req, res) {
    var request = require("request");
    var reqURL = "http://node-red:1880/getData";
    
    console.log("URL: \n", reqURL);

    var httpHeaderOptions = {
        accept: "application/json",
        "content-type": "application/json",
    };

    var restoptions = {
      method: "GET",
      url: reqURL,
      headers: httpHeaderOptions,
    };
    
    console.log("send request");
    request(restoptions, function(error, response, body) {
        console.log("in request \n");
        if (error) {
          console.error("Failed: %s", error.message);
          body = {"error": error.message };
          res.status(400).json(body);
        } else {
          console.log("Success: \n", body);
          res.status(200).json(body);
        }
    });    
});

app.post('/postData', function(req, res) {
    var request = require("request");
    var reqURL = "http://node-red:1880/postData";
    
    console.log("URL: \n", reqURL);
    console.log("POST Body: \n", JSON.stringify(req.body));

    var httpHeaderOptions = {
        accept: "application/json",
        "content-type": "application/json",
    };

    var restoptions = {
      method: "POST",
      url: reqURL,
      headers: httpHeaderOptions,
      body: req.body,
      json: true
    };
    
    console.log("send request \n");

    request(restoptions, function(error, response, body) {
        console.log("in request \n");
        if (error) {
            console.error("Failed: %s", error.message);
            body = {"error": error.message };
            res.status(400).json(body);
        } else {
          console.log("Success: \n", JSON.stringify(body));
          res.status(200).json(body);
        }
    });    
});    


// Start the server
app.listen(port, function () {
    console.log('simple forward server is running')
});
