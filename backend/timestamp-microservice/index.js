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


app.get("/api/:date?", function (req, res) {
  let inputDate = req.params.date;
  let dateObject;

  if (!inputDate) {
    dateObject = new Date();
  } else {
    if (/^\d+$/.test(inputDate)) {
      dateObject = new Date(parseInt(inputDate));
    } else {
      dateObject = new Date(inputDate);
    }
  }

  if (!isNaN(dateObject.getTime())) {
    res.json({
      unix: dateObject.getTime(),
      utc: dateObject.toUTCString()
    });
  } else {
    res.json({
      error: "Invalid Date"
    });
  }
});

const PORT = process.env.PORT || 8080;

var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + PORT);
});
