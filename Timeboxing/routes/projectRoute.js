const express = require('express');
const expressRouter = express.Router();
const authHelper = require('../middleware/authHelper');
const validator = require('../middleware/validate');
const model = require('../models/project');
const crudController = require('../controllers/crudController');

expressRouter.get('/me', authHelper, crudController.getAuthUserModel(model));
expressRouter.get('/',crudController.getQuery(model));
expressRouter.post('/create', validator.validate('createProject'), authHelper, crudController.create(model));
expressRouter.route('/:id')
			.get(crudController.get(model))
			.put(authHelper, crudController.update(model))
			.delete(authHelper, crudController.delete(model));

module.exports = expressRouter;