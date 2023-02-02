const mongoose=require('mongoose')
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema(
    {
        name:{type:String ,required:true},
        email:{type:String ,required:true,unique:true},
        
      
        password:{type:String, required:true},
       
        tokens:[{
            token:{type:String ,required:true}
                }
                    
                ]
},


)

//hash password

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
        
    }
    next();
})

// token
userSchema.methods.generateAuthToken=async function (){
    try {
        let token=jwt.sign({_id:this._id},process.env.SECRETKEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
 }


const user=mongoose.model('USERT',userSchema);

module.exports=user