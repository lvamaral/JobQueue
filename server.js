//import dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Job = require('./model/jobs');

//create instances
var app = express();
var router = express.Router();

//set up port
var port = process.env.API_PORT || 3001;

//configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//to prevent errors from Cross Origin Resource Sharing, set headers to allow CORS with middleware
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  next();
});

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
  res.send("OK");

  //PUT request into queue
  kueURL(req.body.url);
});


//Kue (Queue System)
var kue = require('kue');
var queue = kue.createQueue();

queue.on('job enqueue', function(id, type){
  console.log( 'Job %s got queued of type %s', id, type );
});

function kueURL(url){
  var job = queue.create('fetch', {
    title: 'Fetch Job',
    url: url
  });
  job.on('complete', function(result){
    //CHANGE STATUS ON DB
    console.log('Job completed with data ', result);
  });
  job.on('failed', function(errorMessage){
    //CHANGE STATUS ON DB
    console.log('Job failed');
  }).save();
}

queue.process('fetch', (job,done)=>{
  //ADD as PENDING
  console.log("this job ran", job.data.url);
  addPendingJob(job,done);

});

//
function addPendingJob(job,done){
  var fetchJob = new Job();
  fetchJob.url = job.data.url;

  fetchJob.save((err)=>{
    if (err) {
      console.log(err);
    } else {
      console.log("Job Added to DB");
      done();
    }

  });

}



//
app.listen(port, function() {
  console.log(`App running on port ${port}`);
});
