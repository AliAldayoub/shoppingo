const mongoose = require('mongoose');

const Shcema = mongoose.Schema;

const sellerShcema = new Shema({
	name: {
		type: String,
		require: true
	},
	Phone: {
		type: Number,
		require: true
	},
	address: {
		type: String,
		require: true
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product'
		}
	]
});

module.exports = mongoose.model('Seller', sellerShcema);
