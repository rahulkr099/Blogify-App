const express = require("express");
const path = require("path")
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const blogRoute = require("./routes/blog");
const Blog = require('./models/blog')

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blogify')
                .then(console.log('Mongodb Connected'));
//setting ejs engine
app.set("view engine", "ejs");
//resolving path to get ejs files as frontend
app.set("views", path.resolve("./views"));
//form data encoder
app.use(express.urlencoded({extended:false}));
//cookie parser
app.use(cookieParser());
//cookie authentication
app.use(checkForAuthenticationCookie("token"))
//public ke andar jo bhi h na usko static serve kr do
app.use(express.static(path.resolve("./public")));
//home route
app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs: allBlogs,
    });
})
//user routes for signin and signup
app.use('/user',userRoute);
//blog route for adding blogs
app.use('/blog',blogRoute)

app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`));