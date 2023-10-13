const mongoose = require('mongoose');

const { Schema, model } = mongoose;


const userVerifier = new Schema({

    userId:String,
    uniqueId:String,
    expiresAt:Date,
    createdAt:Date
});

module.exports = model('verifier',userVerifier);