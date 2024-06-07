const authRoute = require("express").Router();
const usermodel = require("../models/User");
const bcrypt = require('bcrypt');



//new user registeration
authRoute.post("/register", async (req, res) => {
    try {
        //password hashed 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //new user created
        const newUser = new usermodel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save the user details and respond
        const savedDetails = await newUser.save();
        res.status(200).json(savedDetails);
    } catch (err) {
        res.status("enter correct detials");
    }

});


//login user
authRoute.post("/login", async (req, res) => {

    try {

        const user = await usermodel.findOne({ email: req.body.email })
        !user && res.status(404).json("email does  not found");

        const passwordVerify = await bcrypt.compare(req.body.password, user.password);

        if (!passwordVerify) {
            res.status(400).json("Invalid password");
        } else {
            // Password is valid, continue with your logic
            res.status(200).json("Authentication successful");
        }
    } catch (error) {
        // Handle any errors that may occur during the bcrypt comparison
        console.error("Error comparing passwords:", error);
        res.status(500).json("Internal server error");
    }

})


module.exports = authRoute;