const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// blog Schema,

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    media:[String],
    postedBy: String,
    likes:[{ type:String,default:'0'}],
  },
  { timestamps: true }
);

module.exports = model('blog',blogSchema);