const express = require('express');

const router = express.Router();

const shopController = require('../controller/shop');
const { check, validationResult } = require('express-validator');

router.post('/addProduct', isAuth, isAdmin, [], shopController.addProduct);

module.exports = router;
