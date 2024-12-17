const {Router} = require("express");
require("dotenv").config();
const router = Router();
const multer = require("multer");
const path = require("path")
const cloudinary = require('cloudinary').v2;
const Blog = require("../models/blog")
const Comment = require("../models/comment");
const streamifier = require('streamifier')

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

const upload = multer();
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

router.post("/", upload.single("coverImage"), async (req, res) => {
    try {
        const { title, body } = req.body;
        const fileBuffer = req.file.buffer;

        const cloudinaryUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });

        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL: cloudinaryUpload.secure_url,
        });

        res.redirect(`/home`);
    } catch (error) {
        console.error("Error uploading blog:", error);
        res.status(500).send("Something went wrong.");
    }
});


module.exports = router;