const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Request not Authorized' });
  }
  const userToken = authorization.split(' ')[1];
  try {
    const { _id } = jwt.verify(userToken, process.env.SECRET);
    req.user = await User.findOne({ _id }).select('username');
  } catch (error) {
    res.status(401).json({ error: 'Request not authorized' });
  }
  next()
};
module.exports = requireAuth;
