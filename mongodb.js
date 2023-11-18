const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/loginT")
.then(() =>{
    console.log("connected");
})
.catch(()=>{
    console.log("failed to connect");
})

const loginSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }

})

const collection=new mongoose.model("Collection1",loginSchema)
module.exports=collection