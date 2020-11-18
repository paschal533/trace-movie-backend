const express = require('express');
const Post = require('../Models/Post');
const router = express.Router();

//submits a post
router.post('/request', async (req, res) => {
    const post = new Post({
        name: req.query.name,
        email: req.query.email,
        type: req.query.type
    });
    try{
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json(err);
    }
});


module.exports = router;