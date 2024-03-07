const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const loginmdw = require("../middleware/loginmdw");
const mongoose = require("mongoose");
const User = mongoose.model("User")


router.get("/user/:id",loginmdw, (req, res)=>{

    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user =>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .then(posts =>{
            res.json({user, posts})
        }).catch(error =>{
            return res.status(422).json({error: error})
        })
    }).catch(error =>{
        return res.status(404).json({error: "User Not Found"})
    })

})

router.put("/follow",loginmdw,(req, res)=>{
    User.findByIdAndUpdate(req.body.followId, {
        $push:{followers:req.user._id}
    },{
        new:true
    }).catch(error=>{
        return res.status(422).json({error:error})
    })

    User.findByIdAndUpdate(req.user._id, {
        $push:{following: req.body.followId}
    },{new:true}).select("-password").then(result => {
        res.json(result)
    }).catch(error =>{
        return res.status(422).json({error:error}) 
    })
})

router.put("/unfollow",loginmdw,(req, res)=>{
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull:{followers: req.user._id}
    },{
        new:true
    }).select("-password").then(res=>{

    }).catch(error=>{
        return res.status(422).json({error:error})
    })

    User.findByIdAndUpdate(req.user._id, {
        $pull:{following: req.body.unfollowId}
    },{new:true}).then(result => {
        res.json(result)
    }).catch(error =>{
        return res.status(422).json({error:error}) 
    })
})

router.put('/updatepic', loginmdw, async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile picture' });
    }
  });

router.post("/search-users", loginmdw, (req, res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>
        res.json({user})
    ).catch(error=>{
        console.log(error)
    })
})

module.exports = router;