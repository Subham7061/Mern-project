const express=require("express");
const app= express();
const mongoose=require("mongoose");
const helmet=require("helmet");
const  morgan=require("morgan");
const dotenv=require("dotenv");
const userRoute=require("./routes/users");
const authRoute=require("./routes/authentication");
const postRoute=require("./routes/posts");
const multer  = require('multer')
const path=require("path");

 dotenv.config();
 mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
}).then(()=>{
  console.log("connected sucessfully");
}).catch((err)=>console.log(err));

app.use("/uploadedImages",express.static(path.join(__dirname,"public/uploadedImages")));

 //middleware

 app.use(express.json());
 app.use(helmet());
 app.use(morgan("common"));

 const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, 'public/uploadedImages')
  },
  filename:  (req, file, cb) =>{
    const uniqueFilename = Date.now()  + file.originalname;
    cb(null, uniqueFilename);
    
  },
});

 const upload = multer({ storage: storage });
 app.post('/api/upload', upload.single('file'), (req, res)=> {
 try{
  res.status(200).json("file uploaded successfully");
console.log(req.file);
 }catch(err){
  console.log(err);
 }
})


 app.use("/api/auth",authRoute);
 app.use("/api/users",userRoute);
 app.use("/api/posts",postRoute);





app.listen(3000,()=>{
    console.log("server is running");
})