const express = require("express");
const productRouter = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/product");


productRouter.post("/add",async(req,res)=>{
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

productRouter.get("/getAllProducts",async (req,res)=>{
    try{
        const products = await Product.find();
        res.status(200).send(products);
    }
    catch(err){
        console.log("Error : "+err);
    }
})

productRouter.get("/getOneProduct",async(req,res)=>{
    try{
        const {name} = req.body;
        const product = await Product.findOne({name});
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

productRouter.delete("/deleteProduct",async(req,res)=>{
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

productRouter.put("/updateProduct",async(req,res)=>{
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



productRouter.use("/",async(res,req)=>{
    res.send("ProductRouter");
})

module.exports = productRouter;