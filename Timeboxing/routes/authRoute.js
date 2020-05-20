const express = require('express');
const expressRouter = express.Router();
const authenticationController = require('../controllers/authenticationController');
const authHelper = require('../middleware/authHelper');


// Routes and their controllers
expressRouter.post('/register', authenticationController.register);
expressRouter.post('/login', authenticationController.login);
expressRouter.post('/logout', authenticationController.logout);
expressRouter.put('/updateUserPassword', authHelper, authenticationController.updateUserPassword)
expressRouter.put('/resetPassword/:resettoken', authenticationController.resetPasswordByToken);
expressRouter.post('/requestReset', authenticationController.requestPasswordReset);
expressRouter.post('/verify', authenticationController.verifyAuth);

module.exports = expressRouter;