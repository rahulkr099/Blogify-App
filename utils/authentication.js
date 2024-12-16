const JWT = require("jsonwebtoken")

const secret = "$uperMan@123";

function createTokenForUser(user){
    const payload = {
        fullName:user.fullName,
        _id: user._id,
        email:user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    }

    const token = JWT.sign(payload,secret);
    return token;
}
function validateToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}
const jwt = require("jsonwebtoken")
require("dotenv").config();


exports.auth = (req, res, next) => {
    try {

        // console.log("Body", req.body.token);
        // console.log("Cookies", req.cookies.token);
        // console.log("Header", req.header("Authorization").replace("Bearer", " "));

        // const token = req.body.token;
        // const token = req.cookie.token 
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if(!token || token === undefined) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }
        // verify the token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            console.log(decode)

            req.user = decode;
        }
        catch (e) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }

        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}
module.exports = {
    createTokenForUser,
    validateToken,
}