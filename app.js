// filepath: /c:/Users/DELL/Documents/Dstixx05/complete-node-bootcamp-master/complete-node-bootcamp-master/4-natours/starter/app.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './Views'));

app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the dist directory in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'dist')));
// }

// Body parser, reading data from body into req.body.
app.use(
  express.json({
    limit: '10kb',
  }),
);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//changes req.host from 127.0.0.1:3000 to localhost
app.use((req, res, next) => {
  if (req.get('host').startsWith('127.0.0.1')) {
    req.headers.host = req.headers.host.replace('127.0.0.1', 'localhost');
  }

  // console.log('This host changer block of code was actually used.');
  next();
});

// app.use((req, res, next) => {
//   console.log('Cookies from app.js', req.cookies); // Log cookies for debugging
//   next();
// });

// Set security HTTP header
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'http://127.0.0.1:3000',
        'https://cdnjs.cloudflare.com',
        'https://api.mapbox.com',
        'https://events.mapbox.com',
        'https://js.stripe.com/v3/',
        'blob:',
      ],
      styleSrc: ["'self'", 'https://api.mapbox.com', 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://api.mapbox.com'],
      connectSrc: ["'self'", 'https://api.mapbox.com', 'http://127.0.0.1:3000'],
      frameAncestors: ["'self'"],
    },
  }),
);

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' 'unsafe-inline' http://127.0.0.1:3000 https://cdnjs.cloudflare.com https://api.mapbox.com https://events.mapbox.com https://js.stripe.com/v3/ blob:; worker-src 'self' blob:;",
  );
  next();
});

const corsOption = {
  origin: ['http://localhost:3000'],
  exposedHeaders: ['Set-cookie'],
  credentials: true,
  sameSite: 'none',
};
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour.',
});

app.use('/api', limiter);

app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// console.log(process.env.NODE_ENV)
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Serve the overview page
app.get('/overview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'overview.html'));
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
