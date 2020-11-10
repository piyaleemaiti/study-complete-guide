// Let and Const
const firstName = 'Piyalee';
const currentAge = 49;
const hasHobbies = true;
// arrow function
const summerizeUser = (userName, userAge, userHasHobbies) => {
  return(
    'Name is ' +
    userName +
    ', age is ' +
    userAge +
    ', and the user has hobbies: ' +
    userHasHobbies
  );
}
const add = (a,b) => a + b;
const addOne = a => a + 1;
const addRamdom = () => 1 + 2;
console.log(summerizeUser(firstName, currentAge, hasHobbies));
console.log(add(1,2));
console.log(addOne(2));
console.log(addRamdom());

// Object and methods
const person = {
  name: 'Piya',
  age: 45,
  greet() {
    console.log('Hi I am ' + this.name);
  }
};
person.greet();

// Array and methods
const hobbies = ['Photography', 'Gardening'];
console.log(hobbies.map((hobby) => 'Hobby: ' + hobby));
console.log(hobbies);

// Spread Operator
const coppiedArr = [...hobbies];
console.log(coppiedArr);

// Rest Operator
const restOp = (...args) => {
  return args;
};
console.log(restOp(1, 2, 3, 4));

// Destructuring
// In functiosn
const printName = ({ name }) => {
  console.log(name);
};
printName(person);
// In object
const { name, age } = person;
console.log(name, age);
// In array
const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);

// Async Code and Promise
const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Done!');
    }, 1500);
  });
  return promise;
};
setTimeout(() => {
  console.log('Timer is done!');
  fetchData()
    .then(text => {
      console.log(text);
      return fetchData();
    })
    .then(text2 => {
      console.log(text2);
    });
}, 2000);

console.log('Hello!')
console.log('Hi!');
