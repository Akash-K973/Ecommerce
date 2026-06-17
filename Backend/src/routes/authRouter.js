const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

authRouter.post("/auth/signup",async (req,res)=>{
    const {firstName,lastName,email,password} = req.body;
    const user = new User({
        firstName,
        lastName,
        email,
        password
    });
  
    const logUser = await user.save();
    console.log(logUser)
    const token = await logUser.getJWT();
    res.cookie("token",token,{expires:new Date(Date.now()+8*360000)})
    res.send(user);
})

authRouter.put("/auth/login",async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email});
        if(!user){
            res.send("Email is Invalid");
        }
        const isValidPassword = await user.validePassword(password);

        if(!isValidPassword){
            res.send("PassWord is Incorrect");
        }
        else{
            const token = await user.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now()+8*360000)})
            res.send(user);
        }

    }
    catch(err){
        console.log("Error:"+err);
    }
})


authRouter.use("/auth",async (req,res)=>{
    res.send("Auth Router");
})

module.exports = authRouter;