mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/dark-v10", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);

const popup = new mapboxgl.Popup({ offset: 25, className: "my-class" })
    .setLngLat(campground.geometry.coordinates)
    .setHTML(`<h5>${campground.title}</h5>`)
    .setMaxWidth("300px")
    .addTo(map);
map.addControl(new mapboxgl.NavigationControl());
