const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const postRouter  = require('./routes/blogRoutes');
const commentRouter = require('./routes/commentRoute');
const comments = require('./models/commentModel');
const multer = require('multer');
const path = require('path');
const app = express();
const storage = multer.diskStorage({
  destination:function (req, file, cb) {
   return cb(null, './uploads/images');
  },
  filename: function(req, file, cb) {
   return cb(
      null,
      `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });
app.get('/', (req, res) => {
  res.send('welcome to naija_gist');
});

app.use(express.static('uploads'));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/naija_gist',userRouter);
app.use('/naija_gist', commentRouter);
app.use('/naija_gist', postRouter);
const port = process.env.PORT;
const uri = process.env.URI;
const connect = async () => {
  try {
    const db_connection = await mongoose.connect(uri);
    console.log('connected to the data base');

    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};
connect();

