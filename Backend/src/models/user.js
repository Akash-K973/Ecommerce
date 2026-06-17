const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String ,
        required : true,
    },
    lastName : { 
        type : String,
    },
    email : {
        type : String,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },

    password : {
        type : String,
    }
},{
    timestamps:true,
}
)

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Akash@973",{
        expiresIn:"7d"
    })
    return token;
}

userSchema.methods.validePassword = async function(passwordInput){
    const user = this;
    const password = user.password;
    return password==passwordInput;
}

module.exports = mongoose.model("User",userSchema);
