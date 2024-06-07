const userRoute = require("express").Router();
// const User = require("../models/User");
const usermodel = require("../models/User");
const bcrypt = require('bcrypt');

userRoute.put("/:id", async (req, res) => {
   //update in the database
   if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
         try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);

         } catch (err) {
            return res.status(500).json(err)
         };
      }
      try {
         const user = await usermodel.findByIdAndUpdate(req.params.id,
            { $set: req.body, }

         );
         res.status(200).json("Account has been updated");
      } catch (err) {
         return res.status(500).json(err);
      }

   }
   else {
      return res.status(500).json("onlu admin can update the recors")

   }
});
   //deletion 
   userRoute.delete("/:id", async (req, res) => {
      if (req.body.userId === req.params.id || req.body.isAdmin) {
         try {
            const user = await usermodel.findByIdAndDelete(req.params.id);
            return res.status(200).json("Account has been deleted");
         } catch (err) {
            return res.status(500).json(err);
         }
      }
      else {
         return res.status(500).json("onlu admin can delete the account")
      }
   });
 
   //get a user
   userRoute.get("/", async (req, res) => {
      const userId = req.query.userId;
      const username = req.query.username;
      try {
        const user = userId
          ? await usermodel.findById(userId)
          : await usermodel.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
      } catch (err) {
        res.status(500).json(err);
      }
    });

    // get all friends  list whome your are following

    userRoute.get("/friend/:userId",async(req,res)=>{
      try{
         const user=await User.findById(req.params.userId);
         const friendList = await Promise.all(
             user.following.map(friendId=>{
               return User.findById(friendId);
             })
         );
         let friendsList=[];
          friendList.map((friend)=>{
            const {_id,username,profilePicture}=friend;
            friendsList.push({_id,username,profilePicture});
         });
         res.status(200).json(friendsList);

      }catch(err){
     res.status(500).json(err);
      }
    })

   //followes
   userRoute.put("/:id/follow",async(req,res)=>{
          if(req.body.userId !== req.params.id)  {
                 try{
                  const userFollower = await usermodel.findById(req.params.id);
                  const following= await usermodel.findById(req.body.userId);
                  if(!userFollower.follower.includes(req.body.userId)){
                      await userFollower.updateOne({$push:{follower: req.body.userId}})
                      await following.updateOne({$push:{following: req.params.id}})
                      res.status(200).json("you followed sucessufully");
                  }
                  else{
                     res.status(403).json("you already follow");
                  }

                 }catch(err){
                  res.status(500).json(err);
                 }
          }
          else{
            res.status(403).json("You cannot follow yourself");
          }
         });

     //unfollow a user
     userRoute.put("/:id/unfollow",async(req,res)=>{
      if(req.body.userId !== req.params.id)  {
             try{
              const userUnFollower = await usermodel.findById(req.params.id);
              const youUnFollow= await usermodel.findById(req.body.userId);
              if(userUnFollower.follower.includes(req.body.userId)){
                  await userUnFollower.updateOne({$pull:{follower: req.body.userId}})
                  await youUnFollow.updateOne({$pull:{following: req.params.id}})
                  res.status(200).json("you unfollowed sucessufully");
              }
              else{
                 res.status(403).json("you already not follow");
              }

             }catch(err){
              res.status(500).json(err);
             }
      }
      else{
        res.status(403).json("You cannot unfollow yourself");
      }


   })




module.exports = userRoute