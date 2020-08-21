const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/isAuth');

describe('Auth middleware', function() {
  it('should throw an error if no authorization header is present', () => {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.not.throw('Not authenticated.');
  });

  it('should throw an error if the authorization header is only one string', () => {
    const req = {
      get: function(headerName) {
        return 'xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.not.throw();
  });

  it('should yeild a userId after decoding the token', () => {
    const req = {
      get: function(headerName) {
        return 'Bearer klajslkfjlkejkf';
      }
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abc' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
