// const MapboxDirections = require('@mapbox/mapbox-gl-directions');
const axios = require("axios");

exports.handler = function(event, context, callback) {
  var fetchDirections = async function() {
    let { origin, destination } = event.queryStringParameters;
    origin = JSON.parse(origin);
    destination = JSON.parse(destination);
    console.log(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${
        origin["longitude"]
      },${origin.latitude}`
    );
    try {
      let res = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${
          origin.longitude
        },${origin.latitude};${destination.longitude},${
          destination.latitude
        }?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiYWxscnlkZXIiLCJhIjoidWs5cUFfRSJ9.t8kxvO3nIhCaAl07-4lkNw`
      );
      let data = res.data;
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          results: data
        })
      });
    } catch (err) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          err: err
        })
      });
    }
  };

  fetchDirections();
};
