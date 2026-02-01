const joi = require("joi");

const validateInput = (req , res , next) => {
     const schema = joi.object({
          name: joi.string().min(3).max(100).required(),
          description: joi.string().required(),
          email: joi.string().email().required(),
          mobileNo: joi.string().pattern(/^[6-9]\d{9}$/).required(),
          address: joi.string().required()
     })

     const { error } = schema.validate(req.body);
     if (error) {
          return res.send("Invalid")
     }
     next();
}

module.exports = validateInput;