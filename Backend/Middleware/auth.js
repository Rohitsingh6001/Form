const jwt = require("jsonwebtoken");
const Login = require("../Models/UserLogin");

async function isLoggedIn(req , res , next){
     const token = req.cookies.token;

     if(!token){
          return res.redirect("/login");
     }
     try{
          const verified = jwt.verify(token , process.env.JWT_SECRET);
          const user = await Login.findById(verified.id);
          if(!user){
               return res.redirect("/login")
          }
          req.user = user;
          next();
     }catch(e){
          res.redirect("/login");
     }
}
module.exports=isLoggedIn;