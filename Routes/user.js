const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isLoggedIn = require("../auth/isLogged");
const Post = require("../models/Post");
const upload = require("../config/multerConfig");

router.get("/home", (req, res) => {
  res.send("home");
});
router.get("/register", (req, res) => {
  res.render("registration.ejs");
});
router.post("/register", async (req, res) => {
  let { name, age, username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(500).send("User already exists");
  }
  //save using bcrypt____
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await User.create({
        name,
        age,
        username,
        email,
        password: hash,
      });
      // console.log(user);
      let token = jwt.sign({ email: email, userid: user._id }, "thisisSecret");
      res.cookie("token", token);
      res.redirect("/profile");
    });
  });
  // console.log();
  // res.redirect('/');
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(500).send("something went wrong");
  }
  bcrypt.compare(password, existingUser.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email: email, userid: existingUser._id }, "thisisSecret");
      res.cookie("token", token);
      res.status(200).redirect("profile");
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

router.get('/profile',isLoggedIn,async(req,res)=>{
console.log(req.user);
 let user = await User.findOne({email:req.user.email}).populate("post");
  res.render("profile",{user});
  console.log(user);
});

router.post('/posts',isLoggedIn,async(req,res)=>{
// console.log(req.user);
 let user = await User.findOne({email:req.user.email});
 let {content} = req.body;
let post = await Post.create({
  user:user._id,
  content : content,

});
user.post.push(post._id);
await user.save();
res.redirect("/profile");
  // console.log(content);

});

router.get("/like/:id",isLoggedIn,async(req,res)=>{
 let post = await Post.findById(req.params.id).populate("user");

 if(post.likes.indexOf(req.user.userid) === -1){
   post.likes.push(req.user.userid);
 }else{
  post.likes.splice(post.likes.indexOf(req.user.userid),1);
 }
 await post.save();
 res.redirect("/profile");
});

router.get("/edit/:id",async(req,res)=>{
  let post = await Post.findById(req.params.id).populate("user");
  res.render("edit",{post});
});
router.post('/update/:id',async(req,res)=>{
  let post = await Post.findOneAndUpdate({_id : req.params.id},{content:req.body.content});
  res.redirect("/profile");


});
router.get("/uploadProfile",(req,res)=>{
  res.render("profileUpload");
});
router.post("/upload",isLoggedIn,upload.single("image"),async(req,res)=>{
// console.log(req.file);
let user = await User.findOne({email:req.user.email});
user.profilepic = req.file.filename;
await user.save();
res.redirect("/profile");
});
module.exports = router;
