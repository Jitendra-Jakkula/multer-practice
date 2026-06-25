const mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date:{
    type : Date,
    default : Date.now,
  },
  content:{
    type : String
  },
  likes : [
    {

      type : mongoose.Schema.Types.ObjectId,
      ref:"user",
    },
],
});
let Post = mongoose.model("Post", postSchema);

module.exports = Post;
