import { Modal } from './UI/Modal';

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateBtn = document.getElementById('locate-btn');

    locateBtn.addEventListener('click', this.locateUserHandle);
    addressForm.addEventListener('submit', this.findAddressHandler);
  }

  locateUserHandle() {
    console.log(navigator.geolocation)
    if (!navigator.geolocation) {
      alert('The location feature is not supported, please use more modern browser or enter address manually.');
      return;
    }
    const modal = new Modal('loading-modal-content', 'Loading location. Please wait.');
    modal.show();
    navigator.geolocation.getCurrentPosition(successResult => {
      modal.hide();
      const coordinates = {
        lat: successResult.coords.latitude,
        lang: successResult.coords.longitude
      }
      console.log(coordinates);
    }, error => {
      alert('Couldn\'t locate you, please enter address manually.');
    });
  }

  findAddressHandler() {

  }
}

new PlaceFinder();