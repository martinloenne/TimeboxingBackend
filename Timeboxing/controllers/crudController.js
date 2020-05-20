const asyncController = require('../middleware/asyncHandler');
const { validationResult } = require('express-validator');


// CONTROLLERS
exports.get = (model) => asyncController(async(req,res,next) => {   // Need a try catch
  const result = await model.findById(req.params.id);
  if (!result) 
  {
    return res.status(404).json({status: `Not found by id of ${req.params.id}`});
  }
  res.status(200).json({ success: true, data: result });
});


exports.getAuthUserModel = (model) => asyncController(async(req,res,next) => {   // Need a try catch
	console.log(model);
	const result = await model.find({ user: { $in: [ req.user._id ] } });
  if (!result) 
  {		
		return res.status(404).json({status: `Not found by id of ${req.params.id}`});
  }
  res.status(200).json({ success: true, data: result });
});


exports.getQuery = (model) =>  asyncController(async(req,res,next) => {   // Need a try catch
	const reqQuery = { ...req.query };
	
	if (req.query.from && req.query.to) {		
		const from = new Date(req.query.from.split(',').join(' ')).toISOString();
		const to = new Date(req.query.to.split(',').join(' ')).toISOString();
		console.log(from + "  " + "  " + to);

		const query = {
			createdAt: {
				$gt: from,
				$lt: to
			}
    };

		await model.find(query, function (err, entries) 
		{
			if(err){
				console.log(err);
				return res.status(404).json({status: `Something went wrong with your query request`});
			}
			console.log(entries);
			return res.status(201).json({amount: entries.length, data: entries});    
		});	
	}
	else
	{
		await model.find(reqQuery, function (err, entries) 
		{
			if(err){
				console.log(err);
				return res.status(404).json({status: `Something went wrong with your query request`});
			}
			console.log(entries);
			res.status(201).json({amount: entries.length, data: entries});    
		});	
	}
});


exports.create = (model) => asyncController(async(req,res,next) => {   
	
	const err = validationResult(req);
	if (!err.isEmpty()) 
	{
		res.status(422).json({ err: err.array() });
		return;
	}
	console.log("hej");
	// Add user to req.body
	console.log(" waaaat: "+ req.user._id);

	req.body.user = req.user._id;

	// Create project from body
	const result = await model.create(req.body);
	


	// Send back
	res.status(201).json({
		success: true,
		data: result
	});
});


exports.update = (model) => asyncController(async(req,res,next) => {   
	let result = await model.findById(req.params.id);
	if (!result) {
    return res.status(404).json({status: `Not found by id of ${req.params.id}`});
	}

	// Verify ownership
	if (result.user.toString() !== req.user._id) {
		return res.status(404).json({status: `This is not your project to update!`});
	}

	result = await model.findByIdAndUpdate(req.params.id, req.body, 
	{
		new: true,  // Returns the new updated entry
		runValidators: true  // False by default, run validators
	});

	res.status(200).json({ success: true, data: result });
});


exports.delete = (model) => asyncController(async(req,res,next) => {
	const result = await model.findById(req.params.id);
  if (!result) {
    return res.status(404).json({status: `Not found by id of ${req.params.id}`});
  }

  if (result.user.toString() !== req.user._id) {
		return res.status(404).json({status: `This is not your project to delete!`});
  }
  await model.remove();
  res.status(200).json({ success: true, data: {} });
});