const asyncController = require('../middleware/asyncHandler');

exports.getTodaysSessions = (model) =>  asyncController(async(req,res,next) => {
	const user = req.user._id;
	// Get the users timezone

	// Get today's date
	var startOfToday = new Date();
	startOfToday.setHours(0,0,0,0);

	// Find all sessions created today
	await model.find({ "createdAt": { "$gte": startOfToday }, user: { $in: [ req.user._id ] } }, function (err, entries) 
	{
		if(err){
			console.log(err);
			return res.status(404).json({status: `Something went wrong with your query request`});
		}
		return res.status(201).json({amount: entries.length, data: entries});    
	}).populate("category").populate("type").populate("project");

});