const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../modals/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller - CreatePost', () => {
  before((done) => {
    mongoose
      .connect(
        'mongodb+srv://m001-student:m001-mongodb-basics@cluster0-kjwk5.mongodb.net/test'
      , { useUnifiedTopology: true, useNewUrlParser: true })
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a'
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  beforeEach(() => {});

  afterEach(() => {});

  it('should add created post to the posts of the creator', (done) => {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: {
        path: 'abc'
      },
      userId: '5c0f66b979af55031b34728a'
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    FeedController.createPost(req, res, () => {}).then(savedUser => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
