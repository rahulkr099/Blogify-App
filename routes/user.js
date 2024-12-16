const {Router} = require("express");
const User = require('../models/user')
const Blog = require('../models/blog')
const router = Router();
//signin routes
router.get('/signin', (req, res)=>{
    return res.render("signin");
})
router.post("/signin", async(req,res)=>{
    const {email, password} = req.body;
    try{
        const token =await User.matchPasswordAndCreateToken(email,password);
        // console.log("User", token)
        return res.cookie("token",token).redirect('/home');
    } catch(error){
        return res.render("signin",{
            error: `Incorrect Email or Password ${error}`,
        })
    }
})
//signup routes
router.get("/signup", (req, res)=>{
    return res.render("signup");
});
router.post("/signup", async(req,res)=>{
    const {fullName, email, password} = req.body;
    await User.create({
        fullName, 
        email,
        password,
    })
    return res.render('signin');
})
//logout routes
router.get('/logout',(req, res)=>{
    res.clearCookie("token").render('signin');
})

module.exports = router;