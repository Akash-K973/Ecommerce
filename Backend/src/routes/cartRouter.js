const express = require("express");
const User = require("../models/user");
const cartRouter = express.Router();
const Cart = require("../models/cart");
const cart = require("../models/cart");
const product = require("../models/product");
const { userAuth } = require("../middleware/auth");


cartRouter.get("/allItems",async(req,res)=>{
    try{
        const carts = await Cart.find()
            .populate("user", "firstName lastName email")
            .populate("items.product");

        if(!carts) {
            res.status(200).json({
                success:true,
                message:"No Products in cart"
            })
        }

        res.status(200).json({
            success: true,
            data: carts,
        });
    }
    catch(err){
       res.status(200).json({
            status:"Failed",
            message:`Error : ${err}`
        })
    }
})

cartRouter.post("/addCart",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        const userId = user._id;
        const { productId, quantity = 1 } = req.body;
        const pro = await product.findOne({ _id:productId});
        const price = pro.price;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalItems: 0,
                totalPrice: 0,
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            cart.totalPrice += price * quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
            });
            cart.totalPrice += price * quantity;
        }

        cart.totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity,0
        );


        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: cart,
        });
    }
    catch(err){  
        res.status(200).json({
            status:"Failed",
            message:`Error : ${err}`
        })
    }
})

cartRouter.put("/updateCart",async(req,res)=>{
    try{
        const { userId, productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        const pro = await product.findById(productId);

        // Update total price based on quantity difference
        cart.totalPrice -= item.quantity * pro.price;

        // Update quantity
        item.quantity = quantity;

        cart.totalPrice += item.quantity * pro.price;

        // Update total items
        cart.totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: cart,
        });
    }
    catch(err){
       res.status(200).json({
            status:"Failed",
            message:`Error : ${err}`
        })
    }
})


cartRouter.delete("/deleteCart",async(req,res)=>{
    try{
        const carts = await Cart.find();
        console.log(carts);
        const { userId } = req.body;

        const cart = await Cart.findOneAndDelete({ user: userId });
        console.log(cart);
        if(cart){
            res.send("Cart Deleted Successfully!");
        }
        else{
            res.send("Cart not found");
        }
    }
    catch(err){
        console.log("Error : "+err);
    }
})

cartRouter.delete("/deleteProductCart",async (req,res)=>{
    try{
        const { userId, productId } = req.body;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    items: {
                        product: productId
                    }
                }
            },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        res.status(200).json({
            message: "Product removed successfully",
            cart
        });
    }
    catch(err){
        res.status(200).json({
            status:"Failed",
            message:`Error : ${err}`
        })
    }
})


module.exports = cartRouter;