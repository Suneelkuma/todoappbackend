const express=require('express')
const bcrypt=require("bcryptjs")
const router=express.Router();
router.use(express.json())
const User=require('../models/userSchema')
const cookieparser=require("cookie-parser")
const middleware=require("../middleware/authenticate")
router.use(cookieparser())
router.get('/',(req,res)=>{
    res.send("hello from router")
})
router.post('/registers',async(req,res)=>{

    try {
        const {name,email,phone,password,work}=req.body

if(!name|| !email||  !password){
    return res.status(4).json({message:"Please fill all the data"})
}
const userExist=await User.findOne({email:email})
if(userExist){
    return res.status(422).json({message:"email already exist"})
}
        const user=await User.create({name,email,phone,password,work});
// hash pasword in user Schema

       await user.save();
        res.status(200).json({
            status:"Success",
            data:user
        })
    } catch (error) {
        res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }
})


// signin routes

router.post('/signin',async(req,res)=>{
    try {
        const {name,email,phone,password,work}=req.body

        if( !email|| !password){
            return res.status(422).json({message:"Please fill all the data"})
        }
        const user=await User.findOne({email:email})
        if(!user){
            return res.status(422).json({message:"Invalid credentials"})
        }
//compare password here
const userExist=await bcrypt.compare(password,user.password)

// token generation using schema 
let token =await user.generateAuthToken();
//cookie storing

res.cookie("jwttoken",token,{
    expires:new Date(Date.now()+25892000000),
    httpOnly:true
})
// res.cookie("jwtoken",token,{
//     expires:new Date(Date.now()+25892000000),
//     httpOnly:true
//   });

console.log(token);

        if(!userExist){
            return res.status(422).json({message:"Invalid credentials"})
        }else{
         
            return res.status(200).json({message:"user login successfully"})
        }
        
    } catch (error) {
        res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }
})


router.get("/about", middleware, (req, res) => {
    res.send(req.rootUser);
  });


  // contactus
router.get("/getdata", (req, res) => {
    res.send(req.rootUser);
  });
  router.get("/logout", (req, res) => {
    res.clearCookie('jwttoken',{path:'/'})
    res.status(200).send("user logout");
  });
module.exports=router