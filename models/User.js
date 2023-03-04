const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
});
const User = mongoose.model('user', UserSchema);
module.exports =  User;