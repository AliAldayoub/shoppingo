require('dotenv').config();
const jwt = require('jsonwebtoken');
const seller = require('../model/seller');
const User = require('../model/user');
const Seller=require('../model/seller.js')
module.exports = async (req, res, next) => {
	const token = req.get('Authorization').split(' ')[2];
	// console.log(token)
	if (!token) {
		res.status(422).json({ message: 'no token access' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.userId=decoded.userId
		const user=await User.findById(req.userId);
		if(user.status===1)
		{
			const seller=await Seller.find({infoUser:user._id});
			req.userCode=decoded.userCode;
		}
		
		next();
	} catch (error) {
		res.status(422).json({ message: 'token is not valid' });
	}
};
