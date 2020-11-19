const express = require('express');
const Post = require('../Models/Post');
const router = express.Router();

//submits a post
router.post('/request', async (req, res) => {
    //console.log(req.body.name, req.body.email, req.body.type);
    const post = new Post({
        name: req.body.name,
        email: req.body.email,
        type: req.body.type
    });
    try{
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json(err);
    }
});


module.exports = router;