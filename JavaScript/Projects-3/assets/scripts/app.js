const buttonModal = document.querySelector('header button');
const modalNode = document.getElementById('add-modal');
const backDropNode = document.getElementById('backdrop');
const cancelMovieButton = modalNode.querySelector('.btn--passive');
const addMovieButton = modalNode.querySelector('.btn--success');
const userInputs = modalNode.querySelectorAll('input');
const entryTextSection = document.getElementById('entry-text');
const list = document.getElementById('movie-list');
const deleteMovieModal = document.getElementById('delete-modal');

const movies = [];

const toggleBackdrop = () => {
  backDropNode.classList.toggle('visible');
};

const updateUI = () => {
  if (movies.length > 0) {
    entryTextSection.style.display = 'none';
  } else {
    entryTextSection.style.display = 'block';
  }
};

const cancelMovieDeletion = () => {
  deleteMovieModal.classList.remove('visible');
  toggleBackdrop();
};

const deleteMovie = (movieId) => {
  let movieIndex = 0;
  for (const movie of movies) {
    if (movie.id === movieId) {
      break;
    }
    movieIndex++;
  }
  movies.splice(movieIndex, 1);
  list.children[movieIndex].remove();
  updateUI();
  cancelMovieDeletion();
};

const deleteMovieHandler = (movieId) => {
  deleteMovieModal.classList.add('visible');
  toggleBackdrop();
  const cancelDeletionButton = deleteMovieModal.querySelector('.btn--passive');
  let confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');

  confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));
  confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');

  cancelDeletionButton.removeEventListener('click', cancelMovieDeletion);

  cancelDeletionButton.addEventListener('click', cancelMovieDeletion);
  confirmDeletionButton.addEventListener('click', deleteMovie.bind(null, movieId));
};

const renderNewMovieElement = (id, title, imgUrl, rating) => {
  const newMovieElement = document.createElement('li');
  newMovieElement.className = 'movie-element';
  newMovieElement.innerHTML = `
    <div class="movie-element__image">
      <img src="${imgUrl}" alt="${title}" />
    </div>
    <div class="movie-element__info">
      <h2>${title}</h2>
      <p>${rating}/5 stars</p>
    </div>
  `;
  newMovieElement.addEventListener('click', deleteMovieHandler.bind(null, id));
  list.append(newMovieElement);
};

const closeMovieModal = () => {
  modalNode.classList.remove('visible');
};

const showMovieModal = () => {
  modalNode.classList.add('visible');
  toggleBackdrop();
};

const clearInputs = () => {
  for (const userInput of userInputs) {
    userInput.value = '';
  }
};

const addMovieButtonHandler = () => {
  const titleValue = userInputs[0].value;
  const imgUrlValue = userInputs[1].value;
  const ratingValue = userInputs[2].value;
  console.log('titleValue', titleValue);
  if (titleValue.trim() === '' || imgUrlValue.trim() === '' || ratingValue.trim() === '' || +ratingValue < 1 || +ratingValue > 5) {
    alert('Please enter valid values(rating between 1 to 5).');
    return;
  }
  const newMovie = {
    id: Math.random().toString(),
    title: titleValue,
    image: imgUrlValue,
    rating: ratingValue,
  };
  movies.push(newMovie);
  console.log(movies);
  closeMovieModal();
  toggleBackdrop();
  clearInputs();
  renderNewMovieElement(newMovie.id, newMovie.title, newMovie.image, newMovie.rating);
  updateUI();
};

const cancelAddMovieButtonHandler = () => {
  closeMovieModal();
  toggleBackdrop();
  clearInputs();
};
const backDropNodeHandler = () => {
  closeMovieModal();
  cancelMovieDeletion();
  clearInputs();
};

buttonModal.addEventListener('click', showMovieModal);
backDropNode.addEventListener('click', backDropNodeHandler);
cancelMovieButton.addEventListener('click', cancelAddMovieButtonHandler);
addMovieButton.addEventListener('click', addMovieButtonHandler);