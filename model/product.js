const mongoose = require('mongoose');

const Shcema = mongoose.Schema;

const productSchema = new Shcema({
	name: {
		type: String,
		required: true
	},
	price: {
		Old: {
			type: Number,
			required: true
		},
		New: {
			type: Number,
			default: 0
		}
	},
	imageUrl: {
		type: String,
		required: true
	},
	size: [ String ],
	type: [ String ],
	descriptions: String,
	colors: [ String ],
	sellerInfo: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Seller'
		}
	]
});
module.exports = mongoose.model('Product', productSchema);
