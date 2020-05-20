const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config.js');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please write a name']
  },
  email: {
    type: String,
    required: [true, 'Please write an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please write a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please write a password'],
    minlength: 5,
    select: false
  },
  resetUserPassToken: String,
  resetUserPassExpiration: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// METHODS
// Encrypts the password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, config.JWT.jwtSecret, {
    expiresIn: config.JWT.jwtExpire
  });
};


userSchema.methods.toJSON = function() {
  var obj = this.toObject(); //or var obj = this;
  delete obj.password;
  return obj;
 }


// Generate hashed token
userSchema.methods.resetToken = function() {
  const resetUserToken = crypto.randomBytes(20).toString('hex');
  this.resetUserPassToken = crypto.createHash('sha256').update(resetUserToken).digest('hex');
  this.resetUserPassExpiration = Date.now() + 10 * 60 * 1000;
  return resetUserToken;
};

// Match username entered password(pass) to a hashed password in db
userSchema.methods.matchUserPassword = async function(pass) {
  return await bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model('user', userSchema);