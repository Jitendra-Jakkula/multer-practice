const express = require("express");
const userRoute = require('./Routes/user');
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const connect = require("./config/connectDB");
// const upload = require("./config/multerConfig");
connect();


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());

app.use('/',userRoute);
app.get('/',(req,res)=>{
    res.send("hello");
})
app.listen(3000);
