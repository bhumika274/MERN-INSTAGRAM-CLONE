const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const loginmdw = require("../middleware/loginmdw")

router.get('/allposts', loginmdw, async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
  
      res.json({ posts });
    } catch (err) {
      console.error(err);
      res.status(500).json({error: "Error fetching posts"}); // Send a more informative error response
    }
});

router.get('/getsubpost', loginmdw, async (req, res) => {
    try {
      const posts = await Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")

  
      res.json({ posts });
    } catch (err) {
      console.error(err);
      res.status(500).json({error: "Error fetching posts"}); // Send a more informative error response
    }
});

router.post('/createpost', loginmdw, async (req, res) => {
    try {
      const { title, body, pic } = req.body;
  
      if (!title || !body || !pic) {
        return res.status(422).json({ error: "Enter all the details" });
      }
  
      req.user.password = undefined; // Remove sensitive information
  
      const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
      });
  
      await post.save(); // Await for the save operation to complete
  
      res.json({ post });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating post"); // Send an informative error response
    }
  });


router.get('/mypost', loginmdw, async (req, res) =>{
    try{
        const posts = await Post.find({postedBy:req.user._id})
        .populate("postedBy", "_id name")
        res.json({posts})
    }catch(err){
        console.error(err);
      res.status(500).json({error: "Error fetching posts"});
    }
})

router.put('/like', loginmdw, (req, res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new: true //to return updated array not the originl one
    }).then(result=>{
        res.json(result);
    }).catch(error=>{
        return res.status(422).json({error:error})
    })

})

router.put('/unlike', loginmdw, (req, res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new: true
    }).then(result=>{
        
        return  res.json(result);

    }).catch(error=>{
            res.status(422).json({error:error})
    })

})

router.put('/comment', loginmdw, (req, res) =>{
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new: true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .then(result=>{
        
        return  res.json(result);

    }).catch(error=>{
            res.status(422).json({error:error})
    })

})

router.delete("/deletepost/:postId", loginmdw, async (req, res) => {
    try {
      const post = await Post.findOne({ _id: req.params.postId }).populate("postedBy", "_id");
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" }); // Use 404 for not found
      }
  
      if (post.postedBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized to delete this post" });
      }
  
      await Post.deleteOne({ _id: post._id });
      
    res.status(204).send(); 
    } catch (error) {
      
        console.error(error); 
      res.status(500).json({ error: "Failed to delete post" }); // Generic error message
    }
  });
module.exports = router;