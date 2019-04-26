const cookie = require("cookie");

exports.handler = function(event, context, callback) {
  const parsedBody = JSON.parse(event.body);
  const { token } = parsedBody;

  const netlifyCookie = cookie.serialize("nf_jwt", token.access_token, {
    secure: true,
    path: "/",
    expires: new Date(token.expires_at)
  });

  const response = {
    jwt: token,
    cookie: netlifyCookie
  };

  callback(null, {
    statusCode: 200,
    headers: {
      "Set-Cookie": netlifyCookie,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify(response)
  });
};
