const yelp = require("yelp-fusion");

exports.handler = function(event, context, callback) {
  const apiKey =
    "E9ws6kbLaQqKYFbjcT67QKcGa97K6X4TQg5OQCV6LKsGksRIFuj9ueQg9BCHHIYy5bnTmXPgHaq60f2clOmebW_1p_342TY4Q92gLsw_k8W8joF39wGNhYb3SKOxWXYx";

  const client = yelp.client(apiKey);

  const { term, location } = event.queryStringParameters;

  const searchRequest = {
    term: term,
    location: location
  };

  // var delay = function(responseItem) {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve({
  //         type: "Feature",
  //         geometry: {
  //           type: "Point",
  //           coordinates: [
  //             responseItem.coordinates.longitude,
  //             responseItem.coordinates.latitude
  //           ]
  //         },
  //         properties: {
  //           ...responseItem
  //         }
  //       });
  //     }, 1000);
  //   });
  // };

  // var geojsonify = async function() {
  //   let items = await client.search(searchRequest);
  //   const noOfItems = items.length;

  // for(var i = 0; i < noOfItems; i++) {
  //   const orderPromise = delay(items[i])
  //   promises.push(orderPromise)
  // }
  // return Promise.all(promises)
  // };

  var fetchFromYelp = async function() {
    try {
      let res = await client.search(searchRequest);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          results: res
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

  fetchFromYelp();
};
