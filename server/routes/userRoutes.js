const express = require('express');
const {
  signUpUser,
  logInUser,
  verifyController,
  resetPassword,
  resetOldPassword,
} = require('../controllers/userController');
const router = express.Router();
router.post('/sign_up',signUpUser)
router.post('/log_in', logInUser);
const path = require('path');
//verify users uuid for email sign up
router.get('/verify/user/:userId/:uniqueId',verifyController)

// redirect users either success or failure
router.get('/verify/user', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/verify.html'));
});
// password reset page

router.get('/reset/password/:date', (req, res) => {
  const { date } = req.params;
  const currentTime = Date.now();
  if (currentTime > date) {
    res.status(400).send(`<h1 style='text-align:center;'>sorry your time for the reset of password has elapsed, please request again</h1>`);
  }else{
    res.sendFile(path.join(__dirname, '../views/ChangePassword.html'));
  }
});

router.post('/reset/password', resetPassword);

//handle reset password from html page
router.patch('/reset/password/', resetOldPassword);

module.exports = router;