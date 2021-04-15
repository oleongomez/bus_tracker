var markers = [];
var map;
var geojson = {}
async function run() {
	// get bus data    
	const locations = await getBusLocations();
	//console.log(new Date());
	geojson = geojson = {
		type: 'FeatureCollection',
		features: []
	}
		locations.forEach((item, index) => {
			var bus_id = item.id
			var latitude = item.attributes.latitude
			var longitude = item.attributes.longitude
			var bus = {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [longitude, latitude]
				},
				"properties": {
					"name": bus_id.toString(),
					"state": item.attributes.current_status,
					"seats": item.attributes.occupancy_status
				}
			}
			geojson.features.push(bus)
		})
	if (markers.length === 0) {
		console.log('initialize')
		geojson.features.forEach((marker) => {
			var mark = document.createElement('div')
			mark.className = 'marker'
			var popup = new mapboxgl.Popup({ offset: 25 }).setText(
				marker.properties.name + "\n" + marker.properties.state + "\n" + marker.properties.seats
			);
			markers.push(new mapboxgl.Marker(mark)
				.setLngLat(marker.geometry.coordinates)
				.setPopup(popup)
				)
		})
		markers.forEach((marker) => {
			marker.addTo(map)
        })
	}
	else {
		console.log('update')
		markers.forEach((marker, index) => {
			marker.setLngLat(geojson.features[index].geometry.coordinates)
        })
    }

    
	// timer
	setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations() {
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json = await response.json();
	return json.data;
}

const drawMap = () => {
	mapboxgl.accessToken = 'pk.eyJ1Ijoib2xlb25nb21leiIsImEiOiJja25ndXBnM3MzMHh5MzFwaGtnYmN1b3hnIn0.4rpk8Bwa9UF9a0xXOyINRg';
	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [-71.092761, 42.357575],
		zoom: 14
	})
	getDate()

}
async function getDate() {
	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	var date = new Date()
	document.getElementById('date_time').innerHTML = date.toLocaleDateString("en-US", options)
	setTimeout(getDate,1000)
}