const express = require('express');
const app = express();
const connectDb = require("./src/database/database");
const cookieParser = require("cookie-parser");
const cors = require ("cors");
const {userAuth} = require("./src/middleware/auth")


app.use(cors());


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./src/routes/authRouter");
const productRouter = require('./src/routes/productRouter');


app.use("/",authRouter);
app.use("/",productRouter);


connectDb().then(()=>{
    console.log("Database connected");
    app.listen(3000,()=>{
    console.log("Server is successfull listening on port 3000");
});
})
.catch((err)=>{
    console.log("Database cannot connected");
})
