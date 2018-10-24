const mongoose = require('mongoose');
const Schema = mongoose.Schema; // allows us to create schema for user model

// model represents entire collection of database
// Schema 

const userSchema = new Schema({
    name:String, // string reference to base string class of JS
});

const User = mongoose.model('users', userSchema);

module.exports = User;