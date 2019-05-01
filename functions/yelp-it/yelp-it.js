// const yelp = require("yelp-fusion");

exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      msg: "Hello, World! " + Math.round(Math.random() * 10)
    })
  });
};

// exports.handler = function(event, context, callback) {
//   console.log(process.env.VUE_APP_YELP_API);
// const apiKey = `${process.env.VUE_APP_YELP_API}`;

// const client = yelp.client(apiKey);

// const { term, location } = event.queryStringParameters;

// const searchRequest = {
//   term: term,
//   location: location
// };

// var fetchFromYelp = async function() {
//   try {
//     let res = await client.search(searchRequest);
// callback(null, {
//   statusCode: 200,
//   body: JSON.stringify({
//     results: "hello"
//   })
// });
//   } catch (err) {
//     callback(null, {
//       statusCode: 200,
//       body: JSON.stringify({
//         err: err
//       })
//     });
//   }
// };

// fetchFromYelp();
// };
