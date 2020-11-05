/* eslint-disable function-call-argument-newline */
const timer = 2000;

const intervalId = setInterval(() => {
  // eslint-disable-next-line no-console
  console.log('Sending analytics...');
}, timer);
document.getElementById('analytics-btn').addEventListener('click', () => {
  clearInterval(intervalId);
});
