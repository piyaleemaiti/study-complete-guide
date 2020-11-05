const button = document.querySelector('button');

const buttonclickHandler = (event) => {
  event.target.disabled = true;
  // eslint-disable-next-line no-console
  console.log('Button was clicked!');
};
button.addEventListener(
'click',
buttonclickHandler
);
