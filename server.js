// eslint-disable-next-line import/no-extraneous-dependencies

const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED REJECTION!💥SHUTTING DOWN');
  console.log(`${err.name}: ${err.message}`);
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! SHUTTING DOWN');
  console.log(err); // Comment out this line
  server.close(() => process.exit(1));
});

// console.log(x);
