var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobsSchema = new Schema({
   status: {type: String, required: true, default: 'pending'},
   url: {type: String},
   createdAt: { type: Date, default: Date.now },
   result: String,
   message: String,
   qid: Number
});

module.exports = mongoose.model('Job', JobsSchema);
