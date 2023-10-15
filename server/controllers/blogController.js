const blogs = require('../models/blogModel');
const mongoose = require('mongoose');
const comments = require('../models/commentModel');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('a9550840a08c4d48851568822dfd3b6d');

const getAllBlogs = async (req, res) => {
  try {
    const response = await blogs.find({}).sort({ createdAt: -1 });
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({ error: 'you are not authorized' });
  }
};
// get single blog
const getSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await blogs.findOne({ _id: id });
    res.status(201).json(response);
  } catch (error) {
    res.status(404).json({ error: 'Blog not found' });
  }
};
// post a single blog
const postBlog = async (req, res) => {
  const { title, content, postedBy } = req.body;
  const files = req.files;
  try {
     const medias = files.map((item) => {
     return item.filename;
     });
    
    if (!files) {
      const result = await blogs.create({
        title,
        content,
        postedBy,
      });
      res.status(200).json(result);
    }
if (files) {
      const result = await blogs.create({
        title,
        content,
        media: medias,
        postedBy,
      });
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
//delete a blog
const deleteBlog = async (req, res) => {
  const { _id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(_id)) {
      const result = await blogs.deleteOne({ _id });
      res.status(200).json('Deleted successfully');
    } else {
      throw Error(
        'the blog you are trying to delete was not found in our resources'
      );
    }
  } catch (error) {
    res.status(401).json(error.message);
    console.log(error.message);
  }
};
//like blog
const likeBlog = async (req, res) => {
  const { _id } = req.params;
  const { username } = req.body;
  try {
    const result = await blogs.findOneAndUpdate(
      { _id },
      { $addToSet: { likes: username } },
      { new: true }
    );
    res.status(200).json(result.likes.length);
  } catch (error) {
    console.log(error.message);
  }
};
// unlike blog
const unlikeBlog = async (req, res) => {
  const { _id } = req.params;
  const { username } = req.body;
  try {
    const result = await blogs.findOneAndUpdate(
      { _id },
      { $pull: { likes: username } },
      { new: true }
    );
  } catch (error) {
    res.status(400).json(error.message);
  }
};
//edit a blog
const editBlog = async (req, res) => {
  const { _id } = req.params;
  const { title, content } = req.body;
  const files = req.files;
  const file = files.map((file) => file.filename);
  try {
    const result = await blogs.findOneAndUpdate(
      { _id },
      {
        title,
        content,
        media: files && file,
      },
      { new: true }
    );
    res.status(201).json('Blog updated successfully');
  } catch (error) {
    console.log(error.message);
    res.status(400).json('An error occurred during blog update');
  }
};
const newsapiget = async (req, res) => {
  try {
    const result = await newsapi.v2.everything({
      //// All options passed to topHeadlines are optional, but you need to include at least one of them
      sources: 'google-news',
      // q: 'politics',
      // category: 'sports',
      language: 'en',
      country: 'ng',
    });
    res.json(result);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  getAllBlogs,
  getSingleBlog,
  postBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  editBlog,
  newsapiget,
};
