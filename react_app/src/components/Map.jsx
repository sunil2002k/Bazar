import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ ploc }) => {
  useEffect(() => {
    if (!ploc || !ploc.coordinates) {
      console.error('Location coordinates not available!');
      return;
    }

    const [latitude, longitude] = ploc.coordinates; // Reverse for Leaflet

    // Initialize the map
    const map = L.map('map').setView([latitude, longitude], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Use your own icon URL
      iconSize: [38, 45], // Size of the icon [width, height]
      iconAnchor: [19, 45], // Anchor the icon (center bottom)
      popupAnchor: [0, -40], // Popup position relative to the icon
    });

    // Add a marker with the custom icon
    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${ploc.title || 'Product Location'}</b>`) // Add a popup
      .openPopup();

    return () => {
      map.remove(); // Cleanup on unmount
    };
  }, [ploc]);

  return (
    <>
    
    <div id="map" style={{ height: '400px', width: '100%',zIndex:'0' }}></div>
    </>
  );
};

export default Map;
