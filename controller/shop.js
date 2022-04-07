exports.addProduct = (req, res, next) => {
	const name = req.body.name;
	let price, oldPrice, newPrice;
	if (req.body.priceBtn === 'on') {
		price = +req.body.price;
	} else {
		oldPrice = +req.body.oldPrice;
		newPrice = +req.body.newPrice;
	}
	const imageUrl = req.body.imageUrl;
	const size = {
		S: req.body.S ? true : false,
		M: req.body.M ? true : false,
		L: req.body.L ? true : false,
		XL: req.body.XL ? true : false,
		XXL: req.body.XXL ? true : false,
		XXXL: req.body.XXXL ? true : false
	};
	const productType = {
		man: req.body.man ? true : false,
		woman: req.body.woman ? true : false,
		boy: req.body.boy ? true : false
	};
	const description = req.body.description;
	const colors = req.body.colors;
};
