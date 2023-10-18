const express = require('express');
const multer = require('multer');
const path = require('path');
const {
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
} = require('../controllers/commentController');
// const requireAuth = require('../middleware/requireAuth');
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage });

//post a comment
router.post('/postComment', upload.single('commentFile'), postComment);
// get comment
router.get('/getComment/:_id', getComment);
//delete a comment
router.delete('/deleteComment/:_id', deleteComment);
//reply to a comment
router.patch('/replyComment/:_id', upload.single('replyFile'), replyComment);
// reply to a reply
router.patch('/replyToReply/:_id', upload.single('replyFile'), replyToReply);
// delete a reply
router.patch('/deleteReply/:_id', deleteReply);
//Like a comment
router.patch('/likeComment/:_id', likeComment);
//unlike a comment
router.patch('/unlikeComment/:_id', unlikeComment);
//like a reply
router.patch('/likeReply/:_id', likeReply);
// unlike a reply
router.patch('/unlikeReply/:_id', unlikeReply);

module.exports = router;
