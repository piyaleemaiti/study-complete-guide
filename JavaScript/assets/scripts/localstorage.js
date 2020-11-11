const storeBtn = document.getElementById('store-btn');
const retrieveBtn = document.getElementById('retrieve-btn');

const userId = 'u123';
const user = {
  name: 'Piyalee',
  age: 30,
  hobbies: ['Photography', 'Gardening'],
}

storeBtn.addEventListener('click', () => {
  sessionStorage.setItem('uid', userId);
  localStorage.setItem('user', JSON.stringify(user));
});

retrieveBtn.addEventListener('click', () => {
  const uId = sessionStorage.getItem('uid');
  const userDetails = JSON.parse(localStorage.getItem('user'));
  console.log(userDetails);
  if (uId) {
    console.log(`User id is ${uId}`);
  } else {
    console.log("Cann't found user id");
  }
});

