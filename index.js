require("dotenv").config();
const express = require("express");
const path = require("path")
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const blogRoute = require("./routes/blog");
const Blog = require('./models/blog')
const auth = require('./utils/authentication')
const fileUpload = require('express-fileupload')
const app = express();
const PORT = process.env.PORT || 8000;  

mongoose.connect(process.env.MONGO_URL).then(console.log('Mongodb Connected'));
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
//fileupload
app.use(fileUpload({
    useTempFiles:true
}))
//home route
app.get('/home',async (req,res)=>{
    const userId = req.user._id;
    // console.log(req.user._id)
    const allBlogs = await Blog.find({createdBy: userId}).populate("createdBy")
    // const allBlogs = await Blog.find({});
    if(!allBlogs.length){
        return res.redirect('/blog/add-new');
    }
    console.log(allBlogs)
    res.render("home",{
        user:req.user,
        blogs: allBlogs,
    });
})
app.get('/all-blogs',async (req,res)=>{
    const userId = req.user._id;
    // console.log(req.user._id)
    const allBlogs = await Blog.find({}).populate("createdBy")
    // const allBlogs = await Blog.find({});
    if(!allBlogs.length){
        return res.redirect('/blog/add-new');
    }
    // console.log(allBlogs)
    res.render("home",{
        user:req.user,
        blogs: allBlogs,
    });
})
app.get('/',async (req,res)=>{
    res.render('signin')
})

//user routes for signin and signup
app.use('/user',userRoute);
//blog route for adding blogs
app.use('/blog',blogRoute);


app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`));