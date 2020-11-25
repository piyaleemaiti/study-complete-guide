import { Modal } from './UI/Modal';
import { Map } from './UI/Map';

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateBtn = document.getElementById('locate-btn');

    locateBtn.addEventListener('click', this.locateUserHandle.bind(this));
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  selectPlace(coordinates) {
    if(this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
  }

  locateUserHandle() {
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
        lng: successResult.coords.longitude
      }
      this.selectPlace(coordinates);
    }, error => {
      alert('Couldn\'t locate you, please enter address manually.');
    });
  }

  findAddressHandler() {

  }
}

new PlaceFinder();