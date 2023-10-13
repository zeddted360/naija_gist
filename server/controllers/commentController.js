const mongoose = require('mongoose');
const comment = require('../models/commentModel');

//add a comment
const postComment = async (req, res) => {
  const file = req.file;
  const { content, username, postId } = req.body;
  try {
    const result = await comment.create({
      postId: postId,
      username: username,
      comment: content,
      media: file ? file.filename : '',
    });
    res.status(201).json(result);
  } catch (error) {
    console.log(error.message);
  }
};

// get comment
const getComment = async (req, res) => {
  const { _id } = req.params;
  try {
    const result = await comment.find({ postId: _id }).sort({ createdAt: -1 });
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
  }
};
//delete a comment
const deleteComment = async (req, res) => {
  const { _id } = req.params;
  try {
    const result = await comment.deleteOne({ _id });
    res.status(200).json({ message: 'Comment successfully deleted' });
  } catch (error) {
    response.status(400).json(error.message);
  }
};

//reply to a comment
const replyComment = async (req, res) => {
  const { _id } = req.params;
  const { replyText, username } = req.body;
  const file = req.file;

  try {
    const author = await comment.findOne({ _id }).select('username');
    const result = await comment.findOneAndUpdate(
      { _id },
      {
        $push: {
          replies: {
            username: username,
            commentId: _id,
            media: file && file.filename,
            reply: `@${author.username} ${replyText}`,
          },
        },
      },
      { new: true }
    );
    res.status(200).json({ message: `reply submitted successfully` });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
const replyToReply = async (req, res) => {
  const { _id } = req.params;
  const { replyText, username, commentId } = req.body;
  const file = req.file;

  try {
    const replies = await comment.findOne({ _id: commentId }).select('replies');
    const reply = replies.replies.find(
      (reply) => reply._id.toString() === _id.toString()
    );
    const commentUserName = reply.username;
    const result = await comment.findOneAndUpdate(
      { _id: commentId },
      {
        $push: {
          replies: {
            username: username,
            commentId: commentId,
            media: file && file.filename,
            reply: `@${commentUserName} ${replyText}`,
          },
        },
      },
      { new: true }
    );
    res.status(200).json({ message: `reply submitted successfully` });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
// delete reply
const deleteReply = async (req, res) => {
  const { _id } = req.params;
  const { commentId } = req.body;
  try {
    const result = await comment.findOneAndUpdate(
      { _id: commentId },
      { $pull: { replies: { _id: _id } } },
      { new: true }
    );
    res.status(200).json({ message: 'reply deleted successfully' });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
//like comment
const likeComment = async (req, res) => {
  const { _id } = req.params;
  const { username } = req.body;
  try {
    const result = await comment.findOne({ _id });
    const likesArray = result.likes;
    if (likesArray.includes(username)) {
      console.log('you have already liked this post');
      return;
    }
    const likes = likesArray.push(username);
    await result.save();
    res.status(200).json(result.likes.length);
  } catch (error) {
    console.log(error.message);
    res.status(400).json('There was an error while trying to like this post');
  }
};

//unlike a comment
const unlikeComment = async (req, res) => {
  const { _id } = req.params;
  const { username } = req.body;
  try {
    const result = await comment.findOne({ _id });
    const likesArray = result.likes;
    if (likesArray.includes(username)) {
      const indexOfUsername = likesArray.indexOf('username');
      likesArray.splice(indexOfUsername, 1);
      await result.save();
    }
    res.status(200).json(result.likes.length);
  } catch (error) {
    console.log(error.message);
    res.status(400).json('There was an error while trying to like this post');
  }
};

// like reply

const likeReply = async (req, res) => {
  const { _id } = req.params;
  const { commentId, username } = req.body;
  try {
    const result = await comment.findOne({ _id: commentId });
    const replies = result.replies;
    const reply = replies.find((reply) => reply._id.toString() === _id);
    const likesArray = reply.likes;
    if (!likesArray.includes(username)) {
      likesArray.push(username);
      await result.save();
    } else {
      console.log('you have already liked this reply');
    }
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error.message);
    res.status(200).json(error.message);
  }
};

const unlikeReply = async (req, res) => {
  const { _id } = req.params;
  const { commentId, username } = req.body;
  try {
    const result = await comment.findOne({ _id: commentId });
    const replies = result.replies;
    const reply = replies.find((reply) => reply._id.toString() === _id);
    const likesArray = reply.likes;
    const indexOfUsername = likesArray.indexOf(username);
    if (likesArray.includes(username)) {
      likesArray.splice(indexOfUsername, 1);
      await result.save();
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: 'failed request' });
  }
};
module.exports = {
  postComment,
  deleteComment,
  replyComment,
  likeComment,
  unlikeComment,
  getComment,
  replyToReply,
  deleteReply,
  likeReply,
  unlikeReply,
};
