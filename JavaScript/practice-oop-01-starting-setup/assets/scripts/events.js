const button = document.querySelector('button');

const buttonclickHandler = event => {
  event.target.disabled = true;
  console.log('Button was clicked!');
};

button.addEventListener('click', buttonclickHandler);
