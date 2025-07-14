const { required } = require("joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
     name : {
          type : String,
          required:true

     },
     email:{
          type : String,
          unique:true
     },
     password : {
          type : String,
          required:true
     }
})

module.exports = mongoose.model("Login" , postSchema);
