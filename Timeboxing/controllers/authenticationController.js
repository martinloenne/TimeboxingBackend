const asyncController = require('../middleware/asyncHandler');
const config = require('../config.js');
const userModel = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Create token
const sendTokenResponse = (User, statusCode, res) => {
  const token = User.getSignedJwtToken();   // Method we have in the user Model
  const tokenOptions = {
    expires: new Date(
      Date.now() + config.JWT.jwtCookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true
  };
  res.status(statusCode).cookie('token', token, tokenOptions).json({
    success: true,
    token
  });
};


// CONTROLLERS
// Make new User
// route(POST): auth/register/
exports.register = asyncController(async(req,res,next) => {
  const { name, email, password } = req.body;
  // Create a new user
  const newUser = await userModel.create({
    name,
    email,
    password
  });
  sendTokenResponse(newUser, 200, res);
});


// Login User
// route(POST): auth/login/
exports.login = asyncController(async(req,res,next) => {
  const { email, password } = req.body; // Get request from body
  // Validate null
  if (!password || !email ) {
    return res.status(400).json({message: 'Credentials Invalid', method: req.method});
  }
  // Find user in db
  const user = await userModel.findOne({ email }).select('+password');
  // User not exist
  if (!user) {
    return res.status(401).json({message: 'Credentials Invalid', method: req.method});
  }
  // Check password
  if (! await user.matchUserPassword(password)) {
    return res.status(401).json({message: 'Credentials Invalid', method: req.method});
  }
  // If ok, send Token back
  sendTokenResponse(user, 200, res);
});

// Logout User
// route(GET): auth/logout/
exports.logout = asyncController(async(req,res,next) => {
  res.cookie('token','none',{expires: new Date(Date.now() + 10 * 1000), httpOnly: true});
  res.status(200).json({success: true, message: 'User logged out', data:{}});
});


// Verify Authentication
// route(POST): auth/verify/
exports.verifyAuth = asyncController(async(req,res,next) => {
  console.log("Running!!!!!!!!!!!!!!!!");
  let token;
  // Header token
  console.log(JSON.stringify(req.headers.authorization));
  console.log(req.body);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
  {
    console.log("Its get in here!");
    token = req.headers.authorization.split(' ')[1];
    console.log("Stringify auth: ", JSON.stringify(req.headers.authorization));
  }
  // From Cookie
  // else if (req.cookies.token) 
  //{
  //   token = req.cookies.token;
  //}
  if (!token)  // Make sure token exists
  {
    return res.status(401).json({message: 'WatNot allowed to access this route, sorry!', method: req.method});
  }

  try  // Verify token
  {
    const decoded = jwt.verify(token, config.JWT.jwtSecret);
    console.log("Verifying: ", decoded);
    req.user = await userModel.findById(decoded.id);  // Puts user into our request
    console.log(req.user);
    //res.send(decoded);
    res.status(200).send({
      success: true,
      decoded,
      user: req.user,
    });
    //return res.status(202).json({message: decoded, method: req.method});
    //next();
  } 
  catch (err) 
  {
    res.status(401).send({
      success: false
    });
    //return res.status(401).json({message: err, method: req.method});
    //return res.status(401).json({message: 'Wat2Not allowed to access this route, sorry!', method: req.method});
  }
});



// Logout User
// route(GET): auth/logout/
exports.logout = asyncController(async(req,res,next) => {
  res.cookie('token','none',{expires: new Date(Date.now() + 10 * 1000), httpOnly: true});
  res.status(200).json({success: true, message: 'User logged out', data:{}});
});






// Need new
// Authenticated change password
exports.updateUserPassword = asyncController(async(req,res,next) => {
  const User = await userModel.findById(req.user.id).select('+password');
  if (! await User.matchUserPassword(req.body.currentUserPassword)) {
    return res.status(401).json({message: 'incorrect password', method: req.method});
  }
  User.password = req.body.newUserPassword;
  await User.save();
  sendTokenResponse(User, 200, res);
});

// Need new
// Password reset by providing token
exports.resetPasswordByToken = asyncController(async (req, res, next) => {
  // hashed token
  const resetUserPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  // Find user by reset token
  const user = await userModel.findOne({resetUserPasswordToken,resetPasswordExpire: { $gt: Date.now() }});
  // If there does not exist a user with reset token return error
  if (!user) {
    return res.status(400).json({message: 'Token is invalid', method: req.method});
  }
  // Else we save the new provided password
  user.password = req.body.password;
  // Sets token reset token back to null
  user.resetUserPasswordToken = undefined;
  user.resetUserPassExpiration = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// Need new
// Request password reset
exports.requestPasswordReset = asyncController(async (req, res, next) => {
  const user = await userModel.findOne({email: req.body.email});
  if (!user) 
  {
    return res.status(404).json({message: 'No user with that email found', method: req.method});
  }
  // Get reset token
  const resetToken = user.resetToken();
  await user.save({ validateBeforeSave: false });

  // The URL to redirect to
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `There has been a request to reset this password. Please make a PUT request to: \n\n ${resetUrl}`;
  try 
  {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
    res.status(200).json({success: true, data:'Email has been send'});
  } 
  catch (error) 
  {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});