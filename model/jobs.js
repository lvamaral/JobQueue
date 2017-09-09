//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var JobsSchema = new Schema({
   status: {type: String, required: true, default: 'pending'},
   url: {type: String},
   createdAt: { type: Date, default: Date.now },
   result: String,
   message: String,
   qid: Number
});

//export our module to use in server.js
module.exports = mongoose.model('Job', JobsSchema);
