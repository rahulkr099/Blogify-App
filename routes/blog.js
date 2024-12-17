const {Router} = require("express");
const router = Router();
require("dotenv").config();
const multer = require("multer");
const path = require("path")

const Blog = require("../models/blog")
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.resolve(process.env.MONGO_URL));
    },
    filename: function (req, file, cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    },
});

const upload = multer({storage: storage})
//add new blog route
router.get('/add-new', (req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    })
});
//open the blog route
router.get('/:id',async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy")
    console.log('blog is ',blog)
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

router.post('/',upload.single('coverImage'),async (req,res)=>{
    try{
        
    const {title, body } = req.body;
   
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        image: { // Store GridFS file ID
            fileId: req.file.id,
            filename: req.file.filename,
            contentType: req.file.mimetype
          },
    })
    // console.log(blog)
    return res.redirect(`/home`)

    }catch(error){
        console.log(`error in uploading is ${error}`)
    }
})


module.exports = router;