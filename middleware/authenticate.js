const jwt=require('jsonwebtoken')
const User=require("../models/userSchema")

const authenticate=async (req,res,next)=>{
try {
    const token=req.cookies.jwttoken;
    const verifytoken=jwt.verify(token,process.env.SECRETKEY);
    
    const rootUser= await User.findOne({_id:verifytoken._id,"tokens.token":token});
if (!rootUser){
    throw new Error('User not found')
}
req.token=token;
req.rootUser=rootUser;
req.userID=rootUser._id;

next()

} catch (error) {
    res.status(401).send("Unautherized")
    console.log(error);
}
}
module.exports=authenticate