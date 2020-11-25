export class Map {
  constructor(coords) {
    this.render(coords);
  }

  render(coordinates) {
    console.log('coordinates', coordinates);
    if (!ol) {
      alert("Couldn't load maps library - please try again later.");
      return;
    }

    document.getElementById('map').innerHTML = ''; // clear the <p> in the <div id="map">
    const map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([coordinates.lng, coordinates.lat]),
        zoom: 16
      })
    });

    // const map = new google.maps.Map(document.getElementById('map'), {
    //   center: coordinates,
    //   zoom: 6,
    // });

    // new google.maps.Marker({
    //   position: coordinates,
    //   map,
    // });
  }
}