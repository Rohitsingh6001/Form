const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const cors = require("cors")
const User = require("./Models/UserModel.js");
const Login = require("./Models/UserLogin.js");
const isLoggedIn = require("./Middleware/auth.js");
const isOwner = require("./Middleware/owner.js");
const isValidate = require("./Middleware/email&NumValidate.js");
dotenv.config();

const port = 8080
const app = express();
app.use(cors());

const connectDB = async () => {
     await mongoose.connect('mongodb://127.0.0.1:27017/FormsData')
          .then(() => console.log("DB Connected"));
}
connectDB();

app.set("view engine", "views");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// api End points 

app.get("/register", (req, res) => {
     res.render("Register.ejs");
})

app.post("/register", async (req, res) => {
     const { name, email, password } = req.body;
     const userExit = await Login.findOne({ email });
     if (userExit) {
          return res.send("User already exists");
     }
     const hash = await bcrypt.hash(password, 10);
     const newUser = new Login({ name, email, password: hash });
     await newUser.save();

     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
     res.cookie("token", token, { httpOnly: true });
     res.redirect("/login")
})

app.get("/login", (req, res) => {
     res.render("Login.ejs");
})

app.post("/login", async (req, res) => {
     const { email, password } = req.body;
     const user = await Login.findOne({ email });
     if (!user) {
          return res.send("User not found");
     }
     const match = await bcrypt.compare(password, user.password);
     if (!match) {
          return res.send("Wrong Password");
     }
     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
     res.cookie("token", token, { httpOnly: true });
     res.redirect("/")
})

app.get("/", async (req, res) => {
     const user = await User.find().populate("createdBy", "name");
     res.render("Views.ejs", { user, currentUser: req.user });
})

app.get("/new", isLoggedIn, (req, res) => {
     res.render("New.ejs");
})

app.post("/new", isLoggedIn, isValidate,async (req, res) => {
     const { name, description, email, mobileNo, address } = req.body;
     const newPost = new User({ name, description, email, mobileNo, address, createdBy:req.user._id});
     await newPost.save();
     res.redirect("/");
})
app.get("/edit/:id", isLoggedIn,isOwner, async (req, res) => {
     const user = await User.findById(req.params.id);
     res.render("Edit.ejs", { user });
})
app.put("/edit/:id", isLoggedIn,isValidate, isOwner, async (req, res) => {
     const { id } = req.params;
     const updatedUser = await User.findByIdAndUpdate(id, req.body)
     await updatedUser.save();
     res.redirect("/");
})

app.delete("/delete/:id", isLoggedIn, isOwner, async (req, res) => {
     await User.findByIdAndDelete(req.params.id);
     res.redirect("/")
})

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");   
});

app.use((req, res) => {
     res.render("error.ejs");
})

app.listen(port, () => {
     console.log("Server is running ");
})