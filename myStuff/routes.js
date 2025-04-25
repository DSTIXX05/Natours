// eslint-disable-next-line no-unused-vars
require(`./app.js`);

const express = require('express');
const getAsset = require('./controller');

const router = express.Router();

// const getAsset = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Gotten!',
//   });
// };

router.route('/').get(getAsset);

module.exports = router;
