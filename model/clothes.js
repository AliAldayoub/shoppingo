const mongoose = require('mongoose');

const Shcema = mongoose.Schema;

const clothesShcema = new Shcema({
	gender:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    percent:{
        type:Number,
        default:0
    },
    size:{
        type:Array,
        required:true
    },
    color:{
        type:Array,
        required:true
    },
    fabricType:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    oldPrice:{
        type:Number
    },
    newPrice:{
        type:Number
    },
    productImage:{
        type:String,
        required:true

    }

});
module.exports = mongoose.model('Clothe', clothesShcema);
