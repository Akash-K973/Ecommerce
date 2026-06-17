const mongoose = require("mongoose");
const connectDb = async ()=>{
    await mongoose.connect("mongodb+srv://akash973:zGKu3fvnjsmGEXY@cluster0.o6gnbzk.mongodb.net/E-commerce");
};

module.exports = connectDb;
