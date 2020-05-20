const express = require('express');
const expressRouter = express.Router();
const authHelper = require('../middleware/authHelper');
const validator = require('../middleware/validate');
const model = require('../models/session');
const crudController = require('../controllers/crudController');
const sessionController = require('../controllers/sessionController');


expressRouter.get('/me', authHelper, crudController.getAuthUserModel(model));
expressRouter.get('/',crudController.getQuery(model));
expressRouter.get('/today',  authHelper, sessionController.getTodaysSessions(model));
expressRouter.post('/create', validator.validate('createSession'), authHelper, crudController.create(model));
expressRouter.route('/:id')
						 .get(crudController.get(model))
						 .put(authHelper, crudController.update(model))
						 .delete(authHelper, crudController.delete(model));

module.exports = expressRouter;