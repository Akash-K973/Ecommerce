const express = require("express");
const productRouter = express.Router();
const jwt = require("jsonwebtoken");


productRouter.use("/",async(res,req)=>{
    res.send("ProductRouter");
})

module.exports = productRouter;