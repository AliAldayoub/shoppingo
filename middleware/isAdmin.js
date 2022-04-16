const User=require("../model/user.js")
module.exports =async (req, res, next) => {
	try {
		// console.log(req.userId)
         const user=await User.findById(req.userId.user);
		//  console.log(user.status)
		if (user.status !== 2) {
			const error = new Error('you are not allowed to edit you need to be an admin');
			error.statusCode = 401;
			throw error;
		}
		next();
	} catch (error) {
		error.statusCode = 500;
		throw error;
	}
};
