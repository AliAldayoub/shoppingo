const Payment = require('../model/payment');
const PaymentReq = require('../model/paymentReq');
const User = require('../model/user');
const { validationResult } = require('express-validator');
const payment = require('../model/payment');
const { all } = require('../routes/managment');
const { default: mongoose } = require('mongoose');

const yearandmonths={
	0:0,
	1:0,
	2:0,
	3:0,
	4:0,
	5:0,
	6:0,
	7:0,
	8:0,
	9:0,
	10:0,
	11:0,
    "year":0
}
const priority={
	1:"BANK",
	2:"AJAR",
	3:"FOATER",
	4:"DEANS",
	5:"OTHERS"
};
function getMonthDifference(startDate, endDate) {
	return (
	  endDate.getMonth() -
	  startDate.getMonth() +
	  12 * (endDate.getFullYear() - startDate.getFullYear())
	);
  }

function sortDate(arraypayments,typedate)
{
	// console.log(arraypayments);
	if(typedate==="high"){
	arraypayments.sort((a,b)=>{
		if(new Date(a.date)<new Date(b.date))
		return 1;
		else 
		if(new Date(a.date)>new Date(b.date))
		return -1;
		else 
		return 0;
	})}
	else
	{
		arraypayments.sort((a,b)=>{
			if(new Date(a.date)>new Date(b.date))
			return 1;
			else 
			if(new Date(a.date)<new Date(b.date))
			return -1;
			else 
			return 0;
		})

	}
}
function sortValue(arraypayments,typedate)
{
	if(typedate==="high"){
	arraypayments.sort((a,b)=>{
		if((+a.value)<(+b.value))
		return 1;
		else 
		if((+a.value)>(+b.value))
		return -1;
		else 
		return 0;
	})}
	else
	{
		arraypayments.sort((a,b)=>{
			if((+a.value)>(+b.value))
			return 1;
			else 
			if((+a.value)<(+b.value))
			return -1;
			else 
			return 0;
		})

	}
}
function sortDateAndValue(arraypayments,typedate,typevalue)
{
	
	
	if(typedate==="high"&&typevalue==="high"){
	
    	arraypayments.sort((a,b)=>{
		if(new Date(a.date)<new Date(b.date)&&(+a.value)<(+b.value))
		{console.log("l");return 1;}
		else if(new Date(a.date)>new Date(b.date)&&(+a.value)>(+b.value))
		{return -1;}
		else return 0;


	})}
	else if(typedate==="low"&&typevalue==="low"){
		arraypayments.sort((a,b)=>{
			if(new Date(a.date)>new Date(b.date)&&(+a.value)>(+b.value))
			return 1;
			else if(new Date(a.date)<new Date(b.date)&&(+a.value)<(+b.value))
			return -1;
			else return 0;
	
	
		})}
	
}
//@router post
//@desc   enter full income
//@view   public
exports.addIncome = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const value = parseInt(req.body.value);
	User.findById(req.userId)
		.then((user) => {
			user.income += value;
			user.totalBalance += value;
			user.save();
			res.status(201).json({ msg: 'income is added' });
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
};
//@router post
//@desc   add a new payment 
//@view   public
exports.addPayment = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const name = req.body.name;
	const value = parseInt(req.body.value);
	const type = req.body.type;
	const date = req.body.date;
	User.findById(req.userId)
		.then((user) => {

			// console.log(value,user.income)
			if (value > user.totalBalance) {
				res.status(401).json({ msg: 'you cant make payment the cost of it more than the total Balance' });
			} else {
				const payment = new Payment({
					name: name,
					value: value,
					type: type,
					date: date
				});

				payment.save();
				user.payments.push(payment._id);
				user.totalBalance -= value;
				user.totalPayments += value;
				user.save();
				res.status(201).json({ message: 'user payment added' });
			}
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
};
//@router post
//@desc   add a new reqpayment
//@view   public
exports.addPaymentReq = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const name = req.body.name;
	const value = parseInt(req.body.value);
	const date = req.body.date;
	const isRepeater = req.body.isRepeater;
	const type=req.body.type;

		let dateNow,
		numOfMonthRepeater = 0,
		everyPaidValueRepeater = 0;
		paymentuntilnow=0;
		almotabaki=0;
	if (isRepeater == true) {
		dateNow = new Date();
		endDate=new Date(date);
		numOfMonthRepeater = getMonthDifference(dateNow,endDate);
		everyPaidValueRepeater = value / numOfMonthRepeater;
	}
	const paymentReq = new PaymentReq({
		name: name,
		value: value,
		date: date,
		type:type,
		isRepeater: isRepeater,
		numOfMonthRepeater: numOfMonthRepeater,
		everyPaidValueRepeater: everyPaidValueRepeater,
		paymentuntilnow:0,
		almotabaki:value

	});
	paymentReq.save();
	User.findById(req.userId)
		.then((user) => {
			user.paymentsReq.push(paymentReq._id);
			user.save();
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
	res.status(201).json({ message: 'user payment Required added' });
};
//@router get
//@desc   get all payments
// //@view   public
exports.getpayments= async (req,res,next)=>{
	const now=new Date()
	const pay=await User.findById(req.userId).populate("payments");
	const filter=pay.payments.filter(payment=>{
		if((new Date(payment.date).getMonth()===now.getMonth()&&new Date(payment.date).getFullYear()!==now.getFullYear())||(new Date(payment.date).getMonth()!==now.getMonth()&&new Date(payment.date).getFullYear()===now.getFullYear()))
		{console.log(2);return false;}
		else
		return true;
	})
	
	res.json({
		pay:filter

	});

}
//@router get
//@desc   get all reqapayments
//@view   public
exports.getreqpayments = async (req, res, next) => {
    const now=new Date()
	const necessorymessage=[];
	const payreq=await User.findById(req.userId).populate("paymentsReq");
	// console.log(payreq.paymentsReq)
	const filter=payreq.paymentsReq.filter(payment=>{
		
		if(new Date(payment.date)<now)
		return false;
		if(new Date(payment.date)===now&&payment.value!==0)
		{
			necessorymessage.push(`you must pay to ${payment.name}`)
		}
		else
		return true;

	})
	
	res.json({
		payreq:filter,
		necessorymessage:necessorymessage

	});

};
//@router get
//@desc   get data for dashboard
//@view   public
exports.getdatadashboard=async(req,res,next)=>{
    
	let all=[];
	const necessorymessage=[];
	const user=await User.findById(req.userId);
	user.totalPayments=0;
	const pay=await User.findById(req.userId).populate("payments");
	const payreq=await User.findById(req.userId).populate("paymentsReq");  
	const now=new Date();
	pay.payments.forEach(payment=>{
		if((new Date(payment.date).getMonth()===now.getMonth()&&new Date(payment.date).getFullYear()!==now.getFullYear())||(new Date(payment.date).getMonth()!==now.getMonth()&&new Date(payment.date).getFullYear()===now.getFullYear()))
	  {;}
		else 
	  	user.totalPayments=user.totalPayments+(+payment.value);
	})
	// console.log(user.totalPayments)
	payreq.paymentsReq.forEach(payment=>{
		
		
		if(new Date(payment.date)<now)
		{;}
		if(new Date(payment.date)===now&&payment.value!==0)
		{
			necessorymessage.push(`you must pay to ${payment.name}`)
		}
		else {
			user.totalPayments=user.totalPayments+(+payment.value);}
	})
	user.totalBalance=user.income-user.totalPayments;
	user.save();
	// count percent for every category
	const categories={
		food:0,
		clothes:0,
		transporation:0,
		schoolCost:0,
		healthInsurunce:0,
		entertainment:0,
		others:0
	}
	yearandmonths["year"]=now.getFullYear();
	for(u in yearandmonths){
		pay.payments.forEach(payment=>{
			if(new Date(payment.date).getFullYear()===now.getFullYear())
			yearandmonths[new Date(payment.date).getMonth()]+=payment.value;
		})}



	yearandmonths[now.getMonth()]=user.totalPayments;
	pay.payments.forEach(payment=>{ 
	 categories[payment.type]=categories[payment.type]+1;
		})
	// get five by five 
	pay.payments.sort((a,b)=>{
		if((+a.value)<(+b.value))
		return 1;
		if((+a.value)>(+b.value))
		return -1;
		return 0;
	})
	payreq.paymentsReq.sort((a,b)=>{
		if((+a.value)<(+b.value))
		return 1;
		if((+a.value)>(+b.value))
		return -1;
		return 0;
	})
    all.push({
		totalBalance:user.totalBalance,
		totalPayments:user.totalPayments,
		income:user.income,
	
	});
	all.push(categories);
	all.push(pay.payments.slice(0,5))
	all.push(payreq.paymentsReq.slice(0,5))
	
	res.json({dash:all,necessorymessage:necessorymessage,yearandmonths:yearandmonths});
}
//@router post
//@desc   get filtered paym
//@view   public
exports.filterPayments=async (req,res,next)=>{
	const user=await User.findById(req.userId);
	const pay=await User.findById(req.userId).populate("payments");
	
	const filterbydate=req.body.filterbydate;
	const filterbytype=req.body.filterbytype;
	if(filterbydate==="high"&&!filterbytype)
	{
		sortDate(pay.payments,filterbydate);
		res.json({
			filterHigh:pay.payments
		})

	}
	else if(filterbydate==="low"&&!filterbytype)
	{
		sortDate(pay.payments,filterbydate);
		res.json({
			filterHigh:pay.payments
		})

	}
	else if(filterbytype&&!filterbydate){
		const filterpayments=pay.payments.filter(payment=>{
			payment.type===filterbytype
		})
		res.json({
			filterpayments:filterpayments
		})
	}
	else if(filterbytype&&filterbydate==="high"){
		const filterpayments=pay.payments.filter(payment=>{
			return payment.type===filterbytype
		})
		sortDate(filterpayments,filterbydate);
		res.json({
			filterpayments:filterpayments
		})
		
	}
	else if(filterbytype&&filterbydate==="low"){
		// console.log(filterbytype);
		const filterpayments=pay.payments.filter(payment=>{
			return payment.type===filterbytype
		})
		sortDate(filterpayments,filterbydate);
		res.json({
			filterpayments:filterpayments
		})
		
	}


}
//@router post
//@desc   get filtered data
//@view   public
exports.filterReqPayments=async (req,res,next)=>{
	const payreq=await User.findById(req.userId).populate("paymentsReq");
	const filterbydate=req.body.filterbydate;
	const filterbyvalue=req.body.filterbyvalue;
	const filterbypri=req.body.filterbypri;
	   
	    if(filterbydate&&!filterbyvalue){
		sortDate(payreq.paymentsReq,filterbydate);
		res.json({
			filterReqPayments:payreq.paymentsReq
		})
	}
	    else if(!filterbydate&&filterbyvalue){
		sortValue(payreq.paymentsReq,filterbyvalue);
		res.json({
			filterReqPayments:payreq.paymentsReq
		})
	}
		else if(filterbydate&&filterbyvalue){
	    	sortDateAndValue(payreq.paymentsReq,filterbydate,filterbyvalue)
	    	res.json({
			   filterReqPayments:payreq.paymentsReq
		    })
	}
	   else if(filterbypri&&!filterbyvalue&&!filterbydate){
		   const all=[];
		//   console.log(1)
		if(filterbypri=="high")
		   {for (u in priority)
		   {
			   const first=payreq.paymentsReq.filter(payment=>{
				   console.log(payment.type)
				   return payment.type===priority[u];
			   })
			   
			  all.push(...first);

		   }
		   res.json({
			filterReqPayments:all
		 })}
		 else
		 {for (let i=5;i>0;i--)
			{
				const first=payreq.paymentsReq.filter(payment=>{
				 //   console.log(payment)
					return payment.type===priority[i];
				})
				
			   all.push(...first);
 
			}
			res.json({
			 filterReqPayments:all
		  })}
 


	  }
	  else if(filterbypri&&filterbyvalue&&!filterbydate){
		const all=[];
	//    console.log(1)
	if(filterbypri==="high")
		{for (u in priority)
		{
			const first=payreq.paymentsReq.filter(payment=>{
			//    console.log(payment)
				return payment.type===priority[u];
			})
			sortValue(first,filterbyvalue);
			
		   all.push(...first);

		}
		res.json({
		 filterReqPayments:all
	  })}
	  else
	  {
		for (let i=5;i>0;i--)
		{
			const first=payreq.paymentsReq.filter(payment=>{
			//    console.log(payment)
				return payment.type===priority[i];
			})
			sortValue(first,filterbyvalue);
			
		   all.push(...first);

		}
		res.json({
		 filterReqPayments:all
	  })
	  }


   }
   else if(filterbypri&&filterbyvalue&&filterbydate){
	const all=[];
//    console.log(1)
if(filterbypri==="high"){
	for (u in priority)
	{
		const first=payreq.paymentsReq.filter(payment=>{
		//    console.log(payment)
			return payment.type===priority[u];
		})
		 sortDateAndValue(first,filterbydate,filterbyvalue);
		
	   all.push(...first);

	}
	res.json({
	 filterReqPayments:all
  })}
  else
  {
	
		for (let i=5;i>0;i--)
		{
			const first=payreq.paymentsReq.filter(payment=>{
			//    console.log(payment)
				return payment.type===priority[i];
			})
			 sortDateAndValue(first,filterbydate,filterbyvalue);
			
		   all.push(...first);
	
		}
		res.json({
		 filterReqPayments:all
	  })
  }


}

	
	
}

exports.addinstallment=async (req,res,next)=>{

	const id=req.params["id"];
	// console.log(typeof(id))
	const now =new Date();
	const paymentReq=await PaymentReq.findById(id);
	paymentReq.numOfMonthRepeater=getMonthDifference(now,new Date(paymentReq.date));
	const necessarymessage=[];
	const {payment}=req.body;
	if(paymentReq.isRepeater===false)
	{
		necessarymessage.push("you are complete all this installment");
		const id1=mongoose.Types.ObjectId(id);
		await PaymentReq.deleteOne({_id:id1});
		res.json({
			necessarymessage:necessarymessage
		})
		
	}
	else {paymentReq.paymentuntilnow=+paymentReq.paymentuntilnow+(+payment);
	paymentReq.almotabaki=(+paymentReq.value)-(+paymentReq.paymentuntilnow);
	paymentReq.numOfMonthRepeater=paymentReq.numOfMonthRepeater-1;
	paymentReq.save();
	if(paymentReq.numOfMonthRepeater===0&&paymentReq.almotabaki>0)
	{
		necessarymessage.push("you must pay all payments ,the time has expired");
		necessarymessage.push("you are pay for this Month");
		res.json({
			paymentReq:paymentReq,
			necessarymessage:necessarymessage
		})}
else	if(paymentReq.almotabaki===0)
	{
		necessarymessage.push("you are complete all this installment");
		const id1=mongoose.Types.ObjectId(id);
		await PaymentReq.deleteOne({_id:id1});
		res.json({
			necessarymessage:necessarymessage
		})
	}else{
		necessarymessage.push("you are pay for this Month");
		res.json({
			paymentReq:paymentReq,
			necessarymessage:necessarymessage
		})}}
}
exports.addmonthlyinstallment=async (req,res,next)=>{
	const id=req.params["id"];
	const now=new Date();
	const paymentReq=await PaymentReq.findById(id);
	paymentReq.numOfMonthRepeater=getMonthDifference(now,new Date(paymentReq.date));
	// console.log(typeof(id))
	const necessarymessage=[];

    if(paymentReq.almotabaki>=paymentReq.everyPaidValueRepeater)
    {paymentReq.paymentuntilnow=+paymentReq.paymentuntilnow+(+paymentReq.everyPaidValueRepeater);
	paymentReq.almotabaki=(+paymentReq.value)-(+paymentReq.paymentuntilnow);
	paymentReq.numOfMonthRepeater=paymentReq.numOfMonthRepeater-1;
	paymentReq.save();}
	else if(+paymentReq.almotabaki<(+paymentReq.everyPaidValueRepeater))
	{
	paymentReq.paymentuntilnow=+paymentReq.paymentuntilnow+(+paymentReq.almotabaki);
	paymentReq.almotabaki=(+paymentReq.value)-(+paymentReq.paymentuntilnow);
	paymentReq.numOfMonthRepeater=paymentReq.numOfMonthRepeater-1;
	paymentReq.save();
	}
	if(paymentReq.numOfMonthRepeater===0&&paymentReq.almotabaki>0)
	{
		necessarymessage.push("you must pay all payments ,the time has expired");
		necessarymessage.push("you are pay for this Month");
		res.json({
			paymentReq:paymentReq,
			necessarymessage:necessarymessage
		})}
	else if(paymentReq.almotabaki===0)
	{
		necessarymessage.push("you are complete all this installment");
		const id1=mongoose.Types.ObjectId(id);
		await PaymentReq.deleteOne({_id:id1});
		res.json({
			necessarymessage:necessarymessage
		})
	}else{
		necessarymessage.push("you are pay for this Month");
		res.json({
			paymentReq:paymentReq,
			necessarymessage:necessarymessage
		})}
}

exports.deleteinstallment=async (req,res,next)=>{
	const id=req.params["id"];
	const id1=mongoose.Types.ObjectId(id);
	const user=await User.findById(req.userId);
    const payments=user.paymentsReq.filter(pay=>{
		  
		if(pay!=id)
		return true;
	})
	user.paymentsReq=payments;
	user.save();
	await PaymentReq.deleteOne({_id:id1});
	const paymentReq=await PaymentReq.find();
	res.json({
		paymentReq:paymentReq

	})
}
exports.updateinstallment=async (req,res,next)=>{
	
	
	const {id,name,value,date,isRepeater}=req.body;
	const paymentReq=await PaymentReq.findById(id);
	const monthly=paymentReq.paymentuntilnow;
	const all=paymentReq.almotabaki;
	if(name)paymentReq.name=name;
	if(value)
	{
		
		paymentReq.value=value;
		paymentReq.numOfMonthRepeater=getMonthDifference(new Date(),new Date(paymentReq.date));
		paymentReq.everyPaidValueRepeater=paymentReq.value/paymentReq.numOfMonthRepeater;
		paymentReq.almotabaki=paymentReq.value-paymentReq.paymentuntilnow;
	}
	if(date)
	{
		paymentReq.date=date;
		paymentReq.numOfMonthRepeater=getMonthDifference(new Date(),new Date(paymentReq.date));
		paymentReq.everyPaidValueRepeater=paymentReq.value/paymentReq.numOfMonthRepeater;
	}
	if(isRepeater)
	{
	  paymentReq.isRepeater=isRepeater;
      paymentReq.numOfMonthRepeater=getMonthDifference(new Date(),new Date(paymentReq.date));
	  paymentReq.everyPaidValueRepeater=paymentReq.value/paymentReq.numOfMonthRepeater;
	  paymentReq.paymentuntilnow=0;
	  paymentReq.almotabaki=paymentReq.value;

	}
	paymentReq.save();
	res.json({
		message:"DONE",
		paymentReq:paymentReq
	})
	
}
exports.updatePayReq=async (req,res,next)=>{
	const id=req.params["id"];
	const paymentReq=await PaymentReq.findById(id);
	res.json({
		paymentReq:paymentReq,
		editing:true
	})
}