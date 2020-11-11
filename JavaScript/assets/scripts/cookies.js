const storeBtn = document.getElementById('store-btn');
const retrieveBtn = document.getElementById('retrieve-btn');

storeBtn.addEventListener('click', () => {
  const userId = 'u123';
  const user = {
    name: 'Piyalee',
    age: 30,
    hobbies: ['Photography', 'Gardening'],
  }
  document.cookie = `uid=${userId}`;
  document.cookie = `user=${JSON.stringify(user)}; max-age=360`;
});

retrieveBtn.addEventListener('click', () => {
  const cookieData = document.cookie.split(';');
  cookieData.map(i => i.trim());
  console.log(cookieData.find(i => i.includes('user')).split('=')[1]);
});
