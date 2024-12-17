const {Router} = require("express");
require("dotenv").config();
const router = Router();
const multer = require("multer");
const path = require("path")
const cloudinary = require('cloudinary').v2;
const Blog = require("../models/blog")
const Comment = require("../models/comment");

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

var uploader = multer({
    storage: multer.diskStorage({}),
    limits: {fileSize:50000000}
})
//add new blog route
router.get('/add-new', (req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    })
});
//open the blog route
router.get('/:id',async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy")
    // console.log('blog is ',blog)
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy")
    return res.render("blog",{
        user: req.user,
        blog,comments,
    });
})
//comment route
router.post('/comment/:blogId', async(req,res)=>{
    const comment = await Comment.create({
        content: req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    })
    // console.log('coomment',comment)
    return res.redirect(`/blog/${req.params.blogId}`)
})

router.post('/',uploader.single('coverImage'),async (req,res)=>{
    const {title, body } = req.body;   
    const file = req.files.coverImage;
    console.log('req. files is ',req.files)
    cloudinary.uploader.upload(file.tempFilePath,async(err,result)=>{
        try{
            const blog = await Blog.create({
                body,
                title,
                createdBy: req.user._id,
                coverImageURL: result.secure_url,
            })
        }catch(err){
            console.log('error is ',err);
        }
    })
    // console.log(blog)
    return res.redirect(`/home`)
})


module.exports = router;