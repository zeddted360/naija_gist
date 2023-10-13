const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();
const verifier = require('../models/verifyModel');
const validator = require('validator');

//signup controller
const signUpUser = async (req, res) => {
  try{
  const token = (_id) => {
    const jwtToken = jwt.sign({ _id }, process.env.SECRET, { expiresIn: '7d' });

    return jwtToken;
  };
  const { username, email, password } = req.body;
  const newUser = await User.signUp(username, email, password);
  const currentUrl = `https://naija-gist-server.vercel.app/`;
  const userToken = token(newUser._id);
  const _id = newUser._id;
  const uniqueId = uuidv4() + _id;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: `Verify email for naija gist`,
    html: `
    <h1>Thank you for signing up for naija gist</h1>
    <p>You have to Click on the link below to complete your sign up process before 12hrs, and proceed to log in</p><br/>
    <span>This link <b>expires in 6hrs</b><br/> <b><a style='margin:1rem;text-decoration:none;font-size:1.5rem;padding:1rem;color:#21222a;' href=${currentUrl + '/naija_gist' + '/verify/user/' + _id + '/' + uniqueId
      }>Verify</a></b> </span>
    `,
  };



  const salt = await bcrypt.genSalt(10);
  const hashedUniqueId = await bcrypt.hash(uniqueId, salt);

  try {
    const result = await verifier.create({
      userId: _id,
      uniqueId: hashedUniqueId,
      expiresAt: Date.now() + 43200000,
      createdAt: Date.now(),
    });
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error.message);
    };
    res.status(200).json('User created successfully');
}catch(error){
  res.status(400).json({error:error.message})
}
};

//controller to handle the clicked email sent
const verifyController = async (req, res) => {
  const { userId, uniqueId } = req.params;
  try {
    const result = await verifier.find({userId:userId});
    if( result.length > 0) {
      // That means user exists
      const { expiresAt } = result[0];
      console.log(expiresAt)
      if( expiresAt < Date.now() ){
        //i.e token expired
        await verifier.deleteOne({userId:userId});
        await User.deleteOne({_id:userId});
        let message = `Sorry Your verification Time is up please sign up again`;
        res.redirect(`/naija_gist/verify/user/?error=true&message=${message}`);

      }else{
        //Update the user to be verified 
        await User.updateOne(
          {_id:userId},
          {$set:{ verified:true }}
          );
          //delete the user verification data
          await verifier.deleteOne({ userId: userId });
          let message = `Congratulations your email has been verified you can now proceed to login`
        res.redirect(`/naija_gist/verify/user/?error=false&message=${message}`);

      };
    }else {
      //user not found
      let message = `This email was sent to you for sign up at nai
      ja gist but it seems you\'ve not signed up or a wrong email was used, please sign up again`
        res.redirect(`/naija_gist/verify/user/?error=true&message=${message}`);

    };
  } catch (error) {
    console.log(error.message)
  }

};

//login controller
const logInUser = async (req, res) => {
  const token = (_id) => {
    const jwtToken = jwt.sign({ _id }, process.env.SECRET, {
      expiresIn: '7d',
    });

    return jwtToken;
  };
  const { email, password } = req.body;
  try {
    const loginUser = await User.logIn(email, password);
    const userToken = token(loginUser._id);
    res.status(200).json({ username: loginUser.username, userToken });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// reset password
const resetPassword = async (req, res) => {
  const currentUrl = `https://naija-gist-server.vercel.app/`;
 
  try{
    const { mail } = req.body;
    const user = await User.findOne({ email: mail });
    const { _id } = user;
    const { password } = user;

    const transporter =  nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: mail,
      subject: `Change Your Password`,
      html: `
    <h1>Follow the instruction below for password reset</h1>
    <p>You have to Click on the link below to complete your password rest process before 10mins, and proceed to log in</p><br/>
    <span>This link <b>expires in 10mins</b><br/> <b><a style='margin:1rem;text-decoration:none;font-size:1.5rem;padding:1rem;color:#21222a;' href=${
      currentUrl + '/naija_gist' + '/reset/password/' + Date.now() + 600000 }>Verify</a></b> </span>
    `,
    };
    transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  res
    .status(200)
    .json({ message: 'check your mail box for more Instructions' });

  }catch(error){
    res.status(400).json('Internal server error');
  }
};

// reset the old password here

const resetOldPassword = async (req, res) => {
  const { mailValue, newPasswordValue,confirmPasswordValue } = req.body;
   const user = await User.findOne({ email: mailValue });
    const { _id } = user;
    let { password } = user;
  try {
    if (!mailValue || !newPasswordValue || !confirmPasswordValue) {
      throw Error('All fields must be filled');
      return;
    };
    if (newPasswordValue !== confirmPasswordValue) {
      throw Error('Password do not match');
      return;
    };
    if(newPasswordValue.length < 6){
      throw Error('Password must be up to six (6) characters');
      return;
    }
    if(!validator.isStrongPassword(newPasswordValue)){
      throw Error(`
      Password not Strong Enough \n
      Password must include an uppercase letter, \n
      a lowercase letter, any number, any alphabet \n
      and any special character and must be up to six (6) characters. 
      `);
      return;
    }
    const checkPassword = await bcrypt.compare(newPasswordValue, password);
    if (checkPassword === true) {
      throw Error('You cannot use the same password again');
      return;
    };
    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(newPasswordValue, salt);
    user.password = newPass;
    const result = await user.save();
    res.status(200).json({message:'password reset successful you can now login',status:true});
  }catch(error){
    res.status(400).json({message:error.message,status:false});
  }
};
module.exports = { signUpUser, logInUser, verifyController, resetPassword,resetOldPassword };
