const express = require('express');
const Post = require('../models/Post');

const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const verifyToken = require('../middleware/auth');

//@POST api/posts
//@desc Create post
//@access Login
router.post('/create', verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  //Simple validation
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: 'Title is required' });
  }
  try {
    const newPost = new Post({
      title,
      description,
      url: url ? (url.startsWith('https://') ? url : `https://${url}`) : null,
      status: status || 'TO LEARN',
      user: req.userId,
    });
    await newPost.save();
    res.json(200, { success: true, message: 'Happy learning', post: newPost });
  } catch (error) {
    console.log(error);
    res.json(500, { success: false, message: 'Internal Server Error' });
  }
});

//@POST api/posts
//@desc Read post
//@access Login
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate('user', [
      'username',
    ]); //.populate() Lấy ra thông tin người đăng
    res.json(200, { success: true, message: '', post: posts });
  } catch (error) {
    console.log(error);
    res.json(500, { success: false, message: 'Internal Server Error' });
  }
});

//@PUT api/posts
//@desc Update post
//@access Login
router.put('/update/:id', verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  // Simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: 'Title is required' });

  try {
    let updatedPost = {
      title,
      description: description || '',
      url: (url.startsWith('https://') ? url : `https://${url}`) || '',
      status: status || 'TO LEARN',
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    // User not authorized to deleted post or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not authorized',
      });

    res.json({
      success: true,
      message: 'Excellent progress!',
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//@DELETE api/posts
//@desc Delete post
//@access Login
router.delete('/delete/:id', verifyToken, async (req, res) => {//Tạo thời xóa hẳn, sau sẽ chuyển qua status
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    // User not authorized or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not authorized',
      });

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
module.exports = router;
