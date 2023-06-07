const express = require('express');
const bodyParser = require('body-parser');
const { geocode } = require('opencage-api-client');
const axios = require('axios');
const app = express();
const { Pool } = require('pg');
app.use(express.json());
require('dotenv').config();
const cors = require('cors');

const { createClient } = require('googlemaps');
// const googleMaps = require('googlemaps');
// Define routes
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
app.use(bodyParser.json());

// Start the server
const port = 3010;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'restaurants',
  password: '1234',
  port: 5432, // or the port number for your PostgreSQL server
});

// Test the connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
  done();
});

// app.post('/create', (req, res) => {
//     const { name, email } = req.body;
//     const query = 'INSERT INTO users (name, email) VALUES ($1, $2)';

//     pool.query(query, [name, email], (err, result) => {
//       if (err) {
//         console.error('Error inserting data:', err);
//         res.status(500).send('Error inserting data');
//       } else {
//         console.log('Data inserted successfully');
//         res.status(200).send('Data inserted successfully');
//       }
//     });
//   });
app.use(cors());



app.post('/searchRestaurants', async (req, res) => {
  const location = req.body.dataInput;
  console.log('Location:', location);
  const API_KEY_GEOCODIN = process.env.API_KEY_GEOCODIN;
  const encodedPlaceName = encodeURIComponent(location);
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedPlaceName}&key=${API_KEY_GEOCODIN}`;
  axios.get(url)
    .then(response => {
      const { lat, lng } = response.data.results[0].geometry;
      const coordinates = { latitude: lat, longitude: lng };
      console.log('Coordinates:', coordinates);
      const API_KEY_GOOGLE = process.env.API_KEY_GOOGLE;
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&type=restaurant&key=${API_KEY_GOOGLE}`
      axios.get(placesUrl)
        .then(response => {
          const results = response.data.results;
          console.log('Restaurants near the location:');
          let restaurantsArr = [];
          results.forEach((result, index) => {
            const counter = index + 1;
            console.log(`${counter}. ${result.name}`);
            const restaurantCoordinates = result.geometry.location;
            const restaurant = {
              name: result.name,
              latitude: restaurantCoordinates.lat,
              longitude: restaurantCoordinates.lng
            };
            restaurantsArr.push(restaurant);
          });
          console.log(restaurantsArr);
          const query = 'INSERT INTO Restaurants (location, restaurants) VALUES ($1,$2)';
          pool.query(query, [location, restaurantsArr], (err, result) => {
            if (err) {
              console.error('Error inserting data:');
              res.status(500).send(['Error inserting data', restaurantsArr, coordinates]);
            } else {
              console.log('Data inserted successfully');
              res.status(200).send(['Data inserted successfully', restaurantsArr, coordinates]);
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
          res.status(500).send(['Error retrieving restaurants', null, null]);
        });
    })
    .catch(error => {
      console.error('Geocoding error:', error);
      res.status(500).send(['Geocoding error', null, null]);
    });
});





