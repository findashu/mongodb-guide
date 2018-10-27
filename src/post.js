const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title : String
});

// only exporting schema not mongoose model
module.exports = PostSchema;