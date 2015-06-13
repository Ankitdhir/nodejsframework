// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  displayName: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};
// create the model for users and expose it to our app
exports.UserSchema = module.exports.UserSchema = userSchema;
exports.boot = module.exports.boot = function (app) {
    mongoose.model('User', userSchema);
    return app.models.User = mongoose.model('User');
};