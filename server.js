var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var fs = require('fs');

mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//load all models
var model_files, model_loc;
app.models = {};
model_loc = __dirname + '/models';
model_files = fs.readdirSync(model_loc);
model_files.forEach(function (file) {
  return (require(model_loc + '/' + file)).boot(app);
});


// routes ======================================================================
var controller_loc = __dirname + '/controllers';
var controller_files = fs.readdirSync(controller_loc);
//load all files inside controllers.
controller_files.forEach(function (file) {
  return (require(controller_loc + '/' + file))(app);
});

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}
app.use(express.static(__dirname + '/client')); 

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});