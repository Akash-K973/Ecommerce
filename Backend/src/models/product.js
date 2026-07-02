const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    catogory : {
        type : String
    },
    price :{
        type:Number
    },
    stock:{
        type:Number
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Product",productSchema);