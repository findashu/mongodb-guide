const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title : String,
    content : String,
    comments : [{ type: Schema.Types.ObjectId, ref: 'comment' }]
});

const BlogPost = mongoose.model('blogPost', BlogSchema);

module.exports = BlogPost;
