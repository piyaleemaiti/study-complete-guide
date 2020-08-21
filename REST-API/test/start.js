const { expect } = require("chai");

it('should be add number', () => {
  const num1 = 2;
  const num2 = 3;
  expect(num1 + num2).to.equal(5);
});

it('should not be equal', () => {
  const num1 = 2;
  const num2 = 3;
  expect(num1 + num2).to.not.equal(6);
});
