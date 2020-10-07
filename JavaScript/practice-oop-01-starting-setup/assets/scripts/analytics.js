const intervalId = setInterval(() => {
  console.log('Sending analytics...');
}, 2000);

document.getElementById('analytics-btn').addEventListener('click', () => {
  clearInterval(intervalId);
});
