const cookie = require("cookie");
const jwt = require("jsonwebtoken");

exports.handler = function(event, context, callback) {
  const referer = event.headers.referer;

  //check that cookies are present
  const { headers } = event;
  const cookieHeader = headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);

  if (cookieHeader === "" || !cookies.nf_jwt) {
    const redirectToURL = referer.match(/\?site=/g)
      ? referer
      : `${referer}?site=${redirectUrl}`;
    return callback(null, {
      statusCode: 302,
      headers: {
        Location: redirectToURL,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({ message: "cookie is not present" })
    });
  }

  let decodedToken;
  try {
    decodedToken = jwt.decode(cookies.nf_jwt, { complete: true });
  } catch (e) {
    console.log(e);
  }

  if (decodedToken === null) {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        message: `Your token is invalid. Logout and log back in`
      })
    });
  }

  const redirectUrl = "https://chipie.netlify.live/admin";
  const html = `
  <html lang="en">
    <head>
      <meta charset="utf-8">
    </head>
    <body>
      <noscript>
        <meta http-equiv="refresh" content="0; url=${redirectUrl}" />
      </noscript>
    </body>
    <script>
      setTimeout(function(){
        window.location.href = ${JSON.stringify(redirectUrl)}
      }, 1000)
    </script>
  </html>`;

  callback(null, {
    statusCode: 200,
    headers: {
      "Set-Cookie": cookies,
      "Cache-Control": "no-cache",
      "Content-Type": "text/html"
    },
    body: html
  });
};
