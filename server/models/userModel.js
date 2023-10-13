const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    verified:Boolean,
  },
  { timestamps: true }
);
//login static method
userSchema.statics.logIn = async function (email, password) {
  const user = await this.findOne({ email });
  if( user.verified === false){
    throw Error('Sorry you cannot login at this time your email has not been verified')
  }
  if (!password || !email) {
    throw Error('All fields must be filled');
  }
  if(password.length < 6){
    throw Error('Password must be up to 6 characters');
  }
  if (!validator.isEmail(email)) {
    throw Error('please enter a correct email');
  }
  if (!user) {
    throw Error('Email is not registered please sign up');
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw Error('Incorrect password');
  }
  return user;
};

// sign up static method
userSchema.statics.signUp = async function (username, email, password) {
  const isEmailExist = await this.findOne({ email });
  const  isUserName = await this.findOne({username})
  if (isEmailExist) {
    throw Error('Email already in use please log in');
  }
  if(isUserName){
    throw Error('Username already in use');
  }
  if (password.length < 6) {
    throw Error('Ooops! too few password');
  }
  if (!username) {
    throw Error('Why no username');
  }
  if (username.length < 2) {
    throw Error('username cannot be a single character');
  }
  if (!validator.isEmail(email)) {
    throw Error('please enter a correct email');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(
      `Too weak password try enter a capital
      letter, a small letter, a number and any special character like '_'`
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ username, email, password: hash,verified:false });

  return user;
};
module.exports = model('User', userSchema);
