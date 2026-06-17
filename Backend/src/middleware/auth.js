const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    try{
    // read token from the cookies
    const {token}=req.cookies;
    if(!token){
        return res.status(401).send("Please login!")
    }
    const decodeObj = await jwt.verify(token,"DEV@Tinder$790");
    
    const {_id}=decodeObj;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User is not found!")
    }
    req.user=user;
    next();
}
    catch(err){
        next(err);
        res.status(400).send("Error" +err.message)
    }
};

module.exports = {userAuth};
