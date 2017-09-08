//import dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Jobs = require('./model/jobs');

//create instances
var app = express();
var router = express.Router();

//set up port
var port = process.env.API_PORT || 3001;

//configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB config using mlab
var mongoDB = 'mongodb://lucas:lucas123@ds129344.mlab.com:29344/job_queue';
mongoose.connect(mongoDB, { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//ROUTES
app.get('/', (req,res)=> {
  res.json({ message: 'API Initialized!'});
});

app.post('/jobs', (req,res) => {

});

//
app.listen(port, function() {
  console.log(`App running on port ${port}`);
});
