//import dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Job = require('./model/jobs');
var axios = require('axios');

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
//

//ROUTES
app.get('/', (req,res)=> {
  res.json({ message: 'API Initialized!'});
});

//gets all current jobs
app.get('/jobs', (req,res)=> {
  Job.find(function(err, jobs) {
     if (err)
       res.send(err);
     res.json(jobs);
   });
});

//gets one job
app.get('/jobs/:id', (req,res)=> {
  Job.find({ "qid" :  req.params.id }, function(err, job) {
     if (err)
       res.send(err);
     res.json(job);
   });
});

//adds a job request to the queue
app.post('/jobs', (req,res) => {
  res.send("OK");
  kueURL(req.body.url);
});
//

//Kue (Queue System)
var kue = require('kue');
var queue = kue.createQueue();

queue.on('job enqueue', function(id, type){
  console.log( 'Job %s got queued.', id);
});

function kueURL(url){
  var job = queue.create('fetch', {
    title: 'Fetch Job',
    url: url
  });
  job.save();
}

queue.process('fetch', (job,done) => {
  //Add Job as PENDING, to be processed
  addPendingJob(job,done);
});

//Deletes completed jobs from the Kue
queue.on('job complete', function(id, result){
  kue.Job.get(id, function(err, job){
    if (err) return;
    job.remove(function(err){
      if (err) throw err;
      console.log('Job #%d is completed and removed from the queue.', job.id);
    });
  });
});

//Job Processing Functions
function addPendingJob(job,done){
  var fetchJob = new Job();
  fetchJob.url = job.data.url;
  fetchJob.qid = job.id;
  fetchJob.save((err)=>{
    if (err) {
      console.log("couldnt save", err);
    } else {
      console.log(`Job ${job.id} (url: ${job.data.url}) added to DB as pending`);
      processPendingJob(fetchJob, done);
    }
  });
}

//tries processing the job, and updates the status depending on success
function processPendingJob(dbJob, done) {
  axios.get(dbJob.url)
  .then( (response) => {
    updateJobStatus(dbJob, response);
  })
  .catch( (error) => {
    console.log("Couldn't fetch URL");
    updateJobStatus(dbJob, "failed");
  });
  done();
}

function updateJobStatus(dbJob, response) {
  Job.findById(dbJob.id, function(err, job) {
      if (response !== "failed") {
        job.status = "completed";
        job.result = response.data;
      } else {
        job.status = "failed";
        job.message = "Could not get URL";
      }
      job.save();
    });
}
//

//Setups app
app.listen(port, function() {
  console.log(`App running on port ${port}`);
});
