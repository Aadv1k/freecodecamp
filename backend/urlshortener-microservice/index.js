require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const { promisify } = require('util');

const port = process.env.PORT || 3000;

const urlDatabase = {};
let counter = 1;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const dnsLookup = promisify(dns.lookup);

async function isURLValid(s) {
  try {
    const { address } = await dnsLookup(new URL(s).hostname);
    return !!address;
  } catch {
    return false;
  }
}

app.post('/api/shorturl', async function (req, res) {
  const originalUrl = req.body.url;

  if (!await isURLValid(originalUrl)) {
    return res.json({ error: 'Invalid URL' });
  }

  const shortUrl = counter++;
  urlDatabase[shortUrl] = originalUrl;
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', function (req, res) {
  const shortUrl = req.params.short_url;

  if (urlDatabase.hasOwnProperty(shortUrl)) {
    const originalUrl = urlDatabase[shortUrl];
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'Short URL not found' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
