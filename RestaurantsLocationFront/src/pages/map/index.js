import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, withGoogleMap, useLoadScript } from "@react-google-maps/api";
import { useLocation } from 'react-router-dom';

const mapContainerStyle = {
  height: "500px",
  width: "100%"
};

const options = {
  zoomControl: true,
};

export default function ShowRestaurantOnMap() {
  const location = useLocation();
  const { data } = location.state || {};
  const mapCenter = { lat: data.coordinates.latitude, lng: data.coordinates.longitude };
  const [restaurants] = useState(data.restaurants);
  const zoomLevel = 15;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY
  });

  useEffect(() => {
    if (isLoaded) {
      // Code to execute after the map is loaded and data is available
      const map = new window.google.maps.Map(document.getElementById("googleMap"), {
        center: mapCenter,
        zoom: zoomLevel,
        options: options
      });
      console.log(restaurants); // Verify the restaurant data in the console
      showMarkers(map); // Show the markers on the map
    }
  }, [isLoaded, restaurants]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  function showMarkers(map) {
    if (restaurants) {
      restaurants.forEach((restaurant, index) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: restaurant.latitude,
            lng: restaurant.longitude
          },
          map: map,
          title: restaurant.name
        });
      });
    } else {
      alert("Restaurant data is not available.");
    }
  }

  return (
    <div>
      <h1>Restaurants Map</h1>
      {isLoaded ? (
        <div id="googleMap" style={mapContainerStyle}></div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
