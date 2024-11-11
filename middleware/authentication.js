const {validateToken}= require('../utils/authentication')
function checkForAuthenticationCookie(cookieName){
    return (req,res, next) =>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
         return next();//don't forget to return if value not find
        }
   
    try{
        const userPayload = validateToken(tokenCookieValue);
        req.user = userPayload;
        return next()
    } catch(error){
        console.log('middleware auth:',error.message)
    }
   return next();//don't forget to return if everything works
   }
}
module.exports = {
    checkForAuthenticationCookie,
}
