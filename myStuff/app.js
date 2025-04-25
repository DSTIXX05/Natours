const express = require('express');

const app = express();

app.use(express.json());

const port = 3000;

app.listen(port, () => {
  console.log('Hello from the server');
});

// app.get('/', (req, res) => {
//   // res.end('Gotten');
//   // console.log('The program ran successfully.');
// });

// eslint-disable-next-line import/no-dynamic-require
const route = require(`${__dirname}/routes.js`);

app.use('/api/v1/1', route);
module.exports = app;
