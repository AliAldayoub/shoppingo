const mongoose = require('mongoose');

const Shcema = mongoose.Schema;

const sellerShcema = new Shcema({
	nameShop: {
		type: String,
		require: true
	},
	emailShop:{
      type:String,
       require:true 
	},
	Phone: {
		type: Number,
		require: true
	},
	address: {
		type: String,
		require: true
	},
	infoUser:{
		type: Shcema.Types.ObjectId,
		ref: 'User',
		
	},
	code:{
		type:String,
		default:0
	}
	
});

module.exports = mongoose.model('Seller', sellerShcema);
