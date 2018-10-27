const mongoose = require('mongoose');
const PostSchema = require('./post');
const Schema = mongoose.Schema; // allows us to create schema for user model

// model represents entire collection of database
// Schema 

const UserSchema = new Schema({
    name:{
        type: String,// string reference to base string class of JS
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than 2 characters'
        },
        required:[true, 'Name is required']
    }, 
    posts:[PostSchema],
    likes:Number
});

//adding virtual property(to get number of posts a user has)
UserSchema.virtual('postCount').get(function() {
    return this.posts.length;
});


const User = mongoose.model('users', UserSchema);

module.exports = User;