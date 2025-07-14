const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     description: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true
     },
     mobileNo: {
          type: Number,
          required: true
     },
     address: {
          type: String,
          required: true
     },
     createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Login',
          required: true
     }
})
module.exports = mongoose.model("User", userSchema);

