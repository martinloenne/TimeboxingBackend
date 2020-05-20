const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
    case 'createCategory': {
     return [ 
        body('userName').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('phone').optional().isInt(),
        body('status').optional().isIn(['enabled', 'disabled'])
       ]   
		}
		case 'createType': {
			return [ 
				 body('name', 'No name').exists()
			]   
		}
		case 'createSession': {
			return [ 
				 body('category', 'No category').exists(),
				 body('type', 'No type').exists(),
				 body('time', 'No time').exists()	
			]   
		 }
		 case 'createProject': {
			return [ 
			]   
		 }
	}
}