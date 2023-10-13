const mongoose = require('mongoose');
const user = require('./userModel');
const blog = require('./blogModel');
const { Schema, model } = mongoose;

// comment schema

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'blog',
      required: true ,
    },  
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    media: String,
    replies: [
      {
        username: String,
        commentId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        media: String,
        reply: {
          type: String,
        },
        createAt: {
          type: Date,
          default: () => Date.now(),
        },
      likes:[String],
      },
    ],
    likes: [String],
  },
  { timestamps: true }
);

module.exports = model('comment', commentSchema);
