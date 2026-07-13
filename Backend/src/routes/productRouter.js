const express = require("express");
const productRouter = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/product");
const { userAuth } = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");


productRouter.post("/addProduct",userAuth,adminAuth,async(req,res)=>{
    const user = req.user;
    console.log(user.email);
    if(user.email!="akashka973@gmail.com") {res.send("Invalid")}
    const {name,catogory,price,stock} = req.body;
    const product = new Product({
        name,
        catogory,
        price,
        stock
    })
    const saveProduct = await product.save();
    res.send(saveProduct);
})

productRouter.get("/getAllProducts",userAuth,adminAuth,async (req,res)=>{
    try{
        const products = await Product.find();
        res.status(200).send(products);
    }
    catch(err){
        console.log("Error : "+err);
    }
})

productRouter.get("/getOneProduct",userAuth,adminAuth,async(req,res)=>{
    try{
        const {_id} = req.body;
        const product = await Product.findOne({_id});
        if(product){
            res.status(200).send(product);
        }
        else{
            res.status(200).send("Product not found!");
        }
    }
    catch(err){
        console.log("Error : "+err);
    }
})

productRouter.delete("/deleteProduct",userAuth,adminAuth,async(req,res)=>{
    try{
        const {_id}= req.body;
        const product = await Product.findOneAndDelete({_id});
        console.log(product);
        if(product){
            res.send("Product Deleted Successfully!");
        }
        else{
            res.send("Product not found");
        }
    }
    catch(err){
        console.log("Error : "+err);
    }
})

productRouter.put("/updateProduct",userAuth,adminAuth,async(req,res)=>{
    try{
        const {_id,...updateData} = req.body;
        const product = await Product.findOne({_id});
        if(!product){
            res.send("Product not found!");
        }
        Object.assign(product,updateData);
        await product.save();
        res.send("Product update Successfully!");

    }
    catch(err){
        console.log("Error : "+err);
    }
})



module.exports = productRouter;