const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const todoSchema=new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,
    ref:"USER"},
activity:{type:String,required:true},
status:{type:String,required:true,},
action:{type:String,required:true},
time:{type:Date,default:Date.now}
},{timeStamps:true})

const todoModel=mongoose.model("TODO",todoSchema);

module.exports=todoModel