const jimp = require('jimp');

const compareImages = async (img1, img2) => {
	const img11 = await jimp.read(img1);
	const img22 = await jimp.read(img2);
	const img111 = img11.resize(256, 256);
	const img222 = img22.resize(256, 256);

	const img1hash = img111.hash();
	const img2hash = img222.hash();

	const distance = jimp.distance(img111, img222);

	const diff = jimp.diff(img111, img222);

	if (img1hash !== img2hash || distance > 0.15 || diff > 0.15) {
		console.log(distance);
		console.log('3333333333333333333333333333333333333333333333');
		console.log(diff);
		return 'img dont matched';
	} else {
		return 'img matched';
	}
};

compareImages('Capture.png', 'Capture2.png')
	.then((result) => {
		console.log(result);
	})
	.catch((err) => console.log(err));
