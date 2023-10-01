// Budget API

const express = require('express');
const { get } = require('http');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(cors());

var whitelist = ['http://localhost:4200', 'http://10.0.0.241:3000'];
var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) { callback(null, true); }
      else { callback(new Error('Not allowed by CORS')); }
    }
  }
  

function getData() {
    try {
        // Read the file synchronously and parse it to return the JSON data
        const data = fs.readFileSync('data.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
        return null; // or some other error indication
    }
}

app.get('/budget', cors(corsOptions), (req, res) => {
    const budget = getData();
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});

