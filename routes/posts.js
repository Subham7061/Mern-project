const postRoute = require("express").Router();
// const Post = require("./models/Post");
const postModel = require("../models/Post");
const userModel = require("../models/User");

//create a post
postRoute.post("/", async (req, res) => {
    const postShare = await new postModel(req.body);
    try {

        await postShare.save()
        res.status(200).json(postShare);

    } catch (err) {
        res.status(500).json(err);
    }
})

//update a post
postRoute.put("/:id", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("post updated");
        }

        else {
            res.status(500).json("you can update only yours posts");

        }
    } catch (err) {
        res.status(403).json(err);
    }
});
//delete a post

postRoute.delete("/:id", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("post deleted");

        } else {
            res.status(403).json("you can delete only your posts");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

///likes and unlike  the post
postRoute.put("/:id/likes", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("you liked the post");

        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("you unliked the post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//comments on the post
postRoute.put("/:id/comments", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        await post.updateOne({ $push: { comment: req.body.userId } });
        res.status(200).json("you commented on the post");

    } catch (err) {
        res.status(500).json(err);
    }
});

//getting all the comments 
postRoute.get("/:id/comments", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        res.status(200).json({ comments: post.comment });
    } catch (err) {
        res.status(500).json(err);
    }
});


//get all the posts
postRoute.get("/allposts/:userId", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        const userPosts = await postModel.find({ userId: user._id });
        const friendsPosts = await Promise.all(
            user.following.map((friendId) => {
                return postModel.find({ userId: friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendsPosts));

    } catch (err) {
        res.status(500).json(err);
    }
});
// get users all post
postRoute.get("/profile/:username", async (req, res) => {
    try {
        const user = await userModel.findOne({username:req.params.username});
        const userPosts = await postModel.find({ userId: user._id });
        
        res.status(200).json(userPosts);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = postRoute;