const { Schema , mongoose} = require("mongoose");
const {createHmac, randomBytes} = require("crypto")
const {createTokenForUser} = require('../utils/authentication')

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
        type: String,
        
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default:"/images/default.png",
    },
    role:{
        type: String,
        enum: ["USER","ADMIN"],//tum in dono ke alawa koi aur value assign nhi kr skte
        default: "USER",
    }
  },
  { timestamps: true }
);
//here we are hashing our password and saving before models created
userSchema.pre("save", function(next){
    const user = this;
    
    if(!user.isModified("password")) return;

    const salt =randomBytes(16).toString();//salt is like secret key
    const hashedPassword = createHmac("sha256",salt)
                                                    .update(user.password)
                                                    .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;

    next();
})
//here we are checking the above (hashed password) with (current password) that user has entered 
//we are hashing the current password and try to match with above hashed password
//bcoz hashed password cannot be back again in its original state
userSchema.static("matchPasswordAndCreateToken",async function (email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found")

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
                .update(password)
                .digest("hex")
    
    if(hashedPassword !== userProvidedHash) throw new Error("Password Incorrect");
    
    const token = createTokenForUser(user);
    return token;

})
// const User = model("user", userSchema);
// module.exports = User;
module.exports = mongoose.model("user", userSchema);