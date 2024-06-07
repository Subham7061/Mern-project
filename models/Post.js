const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
  userId:{
   type:String,
   require:true
  },
  desc:{
    type:String,
    default:"",
  },
  image:{
    type:String,
    default:"",
  },
  likes:{
    type:Array,
    default:[]
  },
  comment:{
    type:Array,
    default:[]
  },
},

{timestamps:true  }

);


module.exports=mongoose.model("Post",postSchema);