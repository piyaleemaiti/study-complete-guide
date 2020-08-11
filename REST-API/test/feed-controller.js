const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../modals/user');
const FeedController = require('../controllers/feed');

describe('Auth Controller - Login', () => {
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


  it('should add created post to the posts of the creator', (done) => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();
    const req = {
      body: {
        email: 'test@est.com',
        password: 'tester',
      }
    };

    AuthController.loginUser(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
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
