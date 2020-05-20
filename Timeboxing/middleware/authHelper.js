const asyncController = require('./asyncHandler');
const config = require('../config');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

// Protect auth routes function
const isAuth = asyncController(async(req,res,next) => {
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
    next();
  } 
  catch (err) 
  {
    return res.status(401).json({message: err, method: req.method});
    //return res.status(401).json({message: 'Wat2Not allowed to access this route, sorry!', method: req.method});
  }
});

module.exports = isAuth;