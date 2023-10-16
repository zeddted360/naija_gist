const express = require('express');
const multer = require('multer');
const path = require('path');
const requireAuth = require('../middleware/requireAuth');

const {
  getAllBlogs,
  getSingleBlog,
  postBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  editBlog,
  newsapiget,
} = require('../controllers/blogController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.join(__dirname,'./uploads/images/'));
  },
  filename: function (req, file, cb) {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage });
const router = express.Router();

//  get all blogs or home page
router.get('/blog/home', getAllBlogs);
// get single blog
router.get('/blog/:id', getSingleBlog);

// post a blog
router.post('/blog/post', upload.array('blogs_files'), postBlog);

// delete a blog;
router.delete('/deleteBlog/:_id', deleteBlog);
//update a blog

//like post
router.patch('/likeBlog/:_id', likeBlog);
//  unlike post . likes has ben handled in update blog
router.patch('/unlikeBlog/:_id', unlikeBlog);
//update blog
router.put('/editBlog/:_id', upload.array('edit_files'), editBlog);
//news api
router.get('/newsapi',newsapiget)

module.exports = router;
