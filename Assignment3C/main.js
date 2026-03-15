// IIFE
console.log("JS is running");
(() => {

    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    const busIcon = L.icon({
        iconUrl: 'bus1.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });

    let busLayer = null;

    async function getBusData(){
        try{
            const url = "https://prog2700.onrender.com/hrmbuses";
            const response = await fetch(url);
            responseCheck(response); //response error handing
            const data = await response.json();

            return data;
        }catch(error){
            console.log(error);
        }
    }

    function getRoutes(busData){
        let routes = /^([1-9]|10|21)$/gi;
        let busRoutes = busData.entity.filter(b => routes.test(b.vehicle.trip.routeId));
        return busRoutes;
    }

    function toGeoJSON(buses) {
        const features = buses.map(b => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    b.vehicle.position.longitude,
                    b.vehicle.position.latitude
                ]
            },
            properties: {
                routeId:   b.vehicle.trip.routeId,
                vehicleId: b.vehicle.vehicle.id,
                label:     b.vehicle.vehicle.label,
                bearing:   b.vehicle.position.bearing  || 0,
                speed:     b.vehicle.position.speed    || 0,
                tripId:    b.vehicle.trip.tripId        || "N/A"
            }
        }));
    
        return {
            type: "FeatureCollection",
            features: features
        };
    }
    function renderBuses(geoJSON) {
        // Remove the previous layer if it exists
        if (busLayer) {
            map.removeLayer(busLayer);
        }
 
        busLayer = L.geoJSON(geoJSON, {
            // pointToLayer turns each GeoJSON point into a Leaflet marker
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, {
                    icon: busIcon,
                    rotationAngle: feature.properties.bearing,
                    rotationOrigin: 'center center'
                });
            },
            // onEachFeature binds a popup to every marker
            onEachFeature: (feature, layer) => {
                const p = feature.properties;
                layer.bindPopup(`
                    <strong>Route ${p.routeId}</strong><br>
                    Vehicle ID: ${p.vehicleId}<br>
                    Speed: ${(p.speed * 3.6).toFixed(1)} km/h<br>
                    Trip ID: ${p.tripId}
                `);
            }
        }).addTo(map);
    }

    async function refreshMap() {
        try {
            const rawData = await getBusData();

            const filtered = getRoutes(rawData);
            const geoJSON = toGeoJSON(filtered);
 
            console.log("Filtered buses (routes 1-10/21):", filtered);
            console.log("GeoJSON:", geoJSON);
 
            renderBuses(geoJSON);
        } catch (error) {
            console.log("Refresh error:", error);
        }
 
        // Schedule the next refresh only AFTER this one finishes
        setTimeout(refreshMap, 7000);
    }

    refreshMap();

    //helper
    function responseCheck(res){
        if(!res.ok){
            throw new Error("Response Error: "+res.status);
        }
    }

})()
