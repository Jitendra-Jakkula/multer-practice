const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  username: String,
  email: String,
  password: String,
  profilepic: {
    type: String,
    default: "image.png",
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  wishlist:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Post",
    },
  ],
});

let User = mongoose.model("User", userSchema);
module.exports = User;
