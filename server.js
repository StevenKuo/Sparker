const express = require('express');
const requestProxy = require('express-request-proxy');
const path = require('path');

const app = express();

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// serve html
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/dist')));
app.get('*', function (req, res) {
  res.set('Cache-Control', 'no-store')
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

var port = normalizePort(process.env.PORT || '3000');
app.listen(port, () => console.log(`Listening on: ${port}`));
