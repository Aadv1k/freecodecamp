// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date", function (req, res) {
  const date = req.params.date;

  let dateObject;

  if (/^\d+$/.test(date)) {
    dateObject = new Date(parseInt(date));
  } else {
    dateObject = new Date(date);
  }

  if (!isNaN(dateObject.getTime())) {
    res.json({
      unix: dateObject.getTime(),
      utc: dateObject.toUTCString()
    });
    return;
  } 
  
  res.json({
    error: "Invalid Date"
  });
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
