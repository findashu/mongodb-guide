const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');
const assert = require('assert');

describe('Associations', () => {
    let joe, blogPost, ncomment ;
    
    beforeEach((done) => {
        joe = new User({name:'Joe'});
        blogPost = new BlogPost({title:'JS is Grt', content:'Yep it really is'});
        ncomment = new Comment({content:'Congrats on great post'});

        joe.blogPosts.push(blogPost);
        blogPost.comments.push(ncomment);
        ncomment.user = joe;

        Promise.all([joe.save(), blogPost.save(), ncomment.save()])
            .then(() => done());
    });

    it('saves a relation between a user and a blogPost', (done) => {
        User.findOne({name:'Joe'})
            .populate('blogPosts') //propertyName in schema
            .then((user) => {
                assert(user.blogPosts[0].title === 'JS is Grt')
                done();
            });
    });

    it('saves a full relation graph', (done) => {
        User.findOne({name: 'Joe'})
            .populate({
                path: 'blogPosts',
                populate: {
                    path : 'comments',
                    model : 'comment',
                    populate:{
                        path:'user',
                        model: 'user' // model name
                    }
                }
            })
            .then((user) => {
                assert(user.name === 'Joe');
                assert(user.blogPosts[0].title === 'JS is Grt');
                assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
                assert(user.blogPosts[0].comments[0].user.name === 'Joe');
                done();
            })
    })
});