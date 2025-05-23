/*eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
  'pk.eyJ1IjoiZHN0aXh4MDUiLCJhIjoiY202aWdybGt5MDdwbzJqc2hmcmF3OHgzNCJ9.UbjeZRaRYDm4WJfTsC7JXg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dstixx05/cm6j84mix008u01sa9ytv0xxo',
  scrollZoom: false
  // center: [-118.113491, 34.111745],
  // zoom: 10,
  // interactive: false;
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  //Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  //Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
  .setLngLat(loc.coordinates)
  .addTo(map);

  new mapboxgl.Popup({
    offset: 30
  })
  .setLngLat(loc.coordinates)
  .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
  .addTo(map);

  //Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: { top: 200, bottom: 150, left: 100, right: 100 },
});
  
}

export function initMapbox() {
  const locations = JSON.parse(document.getElementById('map').dataset.locations);


}