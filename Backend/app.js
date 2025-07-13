const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejs = require("ejs");
const cors = require("cors")
const User = require("./Models/UserModel.js");

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

// api End points 

app.get("/", async (req, res) => {
     const user = await User.find({});
     res.render("Views.ejs", { user });
})

app.get("/new", (req, res) => {
     res.render("New.ejs");
})

app.post("/new", async (req, res) => {
     const { name, description, email, mobileNo, address } = req.body;
     const newPost = await User.create({ name, description, email, mobileNo, address });
     await newPost.save();
     res.redirect("/");
})
app.get("/edit/:id", async (req, res) => {
     const user = await User.findById(req.params.id);
     res.render("Edit.ejs", { user });
})

app.put("/edit/:id", async (req, res) => {
     const { id } = req.params;
     const updatedUser = await User.findByIdAndUpdate(id, req.body)
     await updatedUser.save();
     res.redirect("/");
})

app.delete("/delete/:id", async (req, res) => {
     await User.findByIdAndDelete(req.params.id);
     res.redirect("/")
})

app.use((req, res) => {
     res.render("error.ejs");
})

app.listen(port, () => {
     console.log("Server is running ");
})