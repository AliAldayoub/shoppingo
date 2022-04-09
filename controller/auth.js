require('dotenv').config();
const User = require('../model/user');
const Seller=require('../model/seller.js')
const { validationResult } = require('express-validator');
const bycrpt = require('bcryptjs');
const crypto=require('crypto')
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
// const Seller = require('../model/seller');
const isAuth = require('../middleware/isAuth');
const user = require('../model/user');
exports.admin=async(req,res,next)=>{
	let flog1=true;
	var seller=req.params["email"];
	var seller1=await Seller.find({emailShop:seller});
	var randomNum;
	while(flog1){
	 randomNum=crypto.randomBytes(6).toString("base64");
	const flog=await Seller.find({code:randomNum});
	if(flog.length===0)flog1=false;
}
	 Seller.findById(seller1[0]._id).then(user=>{
		user.code=randomNum;
		user.save();
	 });
var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'sip2-267.nexcess.net',
  port: 587,
  secure: false,
  auth: {
    user:"rouniaaudi.675@gmail.com",
    pass: 'yulla80yulla80'
  }
});

var mailOptions = {
  from: 'rouniaaudi.675@gmail.com',
  to:seller,
  subject: 'Sending Email using Node.js',
  text: `Your code is ${randomNum}! `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


}
exports.upgrade=async(req,res,next)=>{
	const error=validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const {nameShop,emailShop,phone,address,infoUser}=req.body;
	try {
		Seller.findOne({ emailShop: emailShop })
			.then((userdb) => {
				if (userdb) {
					const error = new Error('seller already exists');
					error.statusCode = 422;
					throw error;
				}}).catch(err=>{

				})
                User.findById(req.userId.user).then(user=>{
					user.status=true;
					user.save();
				}).catch(err=>{
					res.send(err.message)
				});
				const user=await User.findById(req.userId.user);
			    user.status=true;
				user.save();
				const seller=new Seller({
					nameShop:nameShop,
					emailShop:emailShop,
					phone:phone,
					address:address,
					infoUser:user
				})
				seller.save()
				res
				.status(201)
				.json({ message: 'user Created!!', seller: seller});
	
			} 
			catch(err){
				error.statusCode = 422;
				throw error;
				}
}

exports.signup = (req, res, next) => {
	const error = validationResult(req);
	// console.log(error);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;
	try {
		User.findOne({ email: email })
			.then((userdb) => {
				if (userdb) {
					const error = new Error('user already exists');
					error.statusCode = 422;
					throw error;
				}
				const salt = bycrpt.genSalt(12);
				bycrpt
					.hash(password, 12)
					.then((hashedPassword) => {
						const user = new User({
							name: name,
							email: email,
							password: hashedPassword
						});
						return user.save();
					})
					.then((user) => {
						const userId = { user: user._id };
						jwt.sign(userId, process.env.JWT_SECRET_KEY, (err, token) => {
							if (err) {
								const error = new Error(err.message);
								error.statusCode = 422;
								throw error;
							}
							res
								.status(201)
								.json({ message: 'user Created!!', user: user, token });
						});
					});
			})
			.catch((err) => {
				if (!err.statusCode) {
					err.statusCode = 500;
				}
				next(err);
			});
	} catch (error) {
		error.statusCode = 422;
		throw error;
	}
};

/////////////////////////////////////LOGIN controlller///////////////////////////////////////

exports.login = async (req, res, next) => {
	const error = validationResult(req);
	console.log(error);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	var userCode;
	const email = req.body.email;
	const password = req.body.password;
	const code=req.body.code;
	if(code){
		const seller=await Seller.find({code:code});
		console.log(seller[0].emailShop,email)
		if(!seller)
		{
			const error = new Error(" The code is not corect");
				error.statusCode = 422;
				throw error;

		}
		if(seller[0].emailShop!==email){
			const error = new Error("email with code not accept");
				error.statusCode = 422;
				throw error;
		}
		userCode=seller[0]._id.toString();
		
	}
	try {
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					const error = new Error('Email is not exist');
					error.statusCode = 422;
					throw error;
				}
				bycrpt
					.compare(password, user.password)
					.then((isEqual) => {
						if (!isEqual) {
							const error = new Error('password is not correct');
							error.statusCode = 401;
							throw error;
						}
					
						const userId = user._id.toString();
						jwt.sign({userId,userCode}, process.env.JWT_SECRET_KEY, (err, token) => {
							if (err) {
								const error = new Error(err.message);
								error.statusCode = 422;
								throw error;
							}
							res.status(201).json({ message: 'user Login!!', userId: userId, token: token });
						});
					})
					.catch((err) => {
						if (!err.statusCode) {
							err.statusCode = 500;
						}
						next(err);
					});
			})
			.catch((err) => {
				if (!err.statusCode) {
					err.statusCode = 500;
				}
				next(err);
			});
	} catch (error) {
		error.statusCode = 500;
		throw error;
	}
};
