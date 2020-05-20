const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config.js');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const xss = require('xss-clean');
const helmet = require('helmet');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');


// Database
const db = require('./db');
db();


// Start application
const application = express();


// Parsers
application.use(express.json());
application.use(cookieParser());
application.use(bodyParser.urlencoded({extended: true}))
application.use(bodyParser.json());


// Security
application.use(xss()); // Sanitize user input coming from POST body, GET queries, and url params
application.use(helmet());
application.use(mongoSanitize()); // Remove $ operator
application.use(hpp());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
application.set('trust proxy', 1); // trust first proxy
application.use(session({
  secret: 'cookiesNumNum',
  name: 'sessionId'
}));
application.use(limiter);


// Setup routes
application.use('/auth', require('./routes/authRoute'));
application.use('/user', require('./routes/userRoute'));
application.use('/project', require('./routes/projectRoute'));
application.use('/category', require('./routes/categoryRoute'));
application.use('/type', require('./routes/typeRoute'));
application.use('/session', require('./routes/sessionRoute'));


// Errors
process.on("unhandledRejection", (error, promise) => {
  console.log("Some promise went very wrong at:", promise, "The reason being:", error);
});


// Start Server
const apiServer = application.listen(config.app.port, () => {
  console.log('API started on: ', config.app.port);
});