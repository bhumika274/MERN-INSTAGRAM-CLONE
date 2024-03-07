const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {LOGINTOKGEN} = require("../config/keys")
const loginmdw = require("../middleware/loginmdw");


router.post('/signup', (req, res)=>{
    const {name,email,password, pic}=req.body
    
    if( !name || !email || !password){
        return res.status(422).json({error:"enter all the fields"})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(savedUser){
            return res.status(422).json({error:"User Already Registered with given email ID"})
        }
        bcrypt.hash(password, 12).then(hashedp =>{
            const user = new User({
                name,
                email,
                password:hashedp,
                pic
            })
    
            user.save().then(user =>{
                res.json({message:"saved Successfully"})
            }).catch(err =>{
                console.log(err)
            })
        }).catch(err =>{
            console.log(err)
        })
    })
})

router.post('/signin', async (req, res) => {
    try {
      const {email, password } = req.body;
  
      if (!email || !password) {
        return res.status(422).json({ message: "Enter email/password" });
      }
  
      const savedUser = await User.findOne({ email });
  
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email/Password" });
      }
  
      const match = await bcrypt.compare(password, savedUser.password);
  
      if (!match) {
        return res.status(422).json({ error: "Invalid email or password" });
      }else{
  
      const token = jwt.sign({ _id: savedUser._id }, LOGINTOKGEN);
      const {_id, name, email, followers, following, pic } = savedUser;
      res.json({ token, user: { _id, name, email,followers, following, pic } });
    }
    } catch (err) {
      console.error("Sign-in error:", err);
      res.status(500).json({ message: "Internal server error" }); // Send a generic error response
    }
  });
  
module.exports = router;