const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../Models/tourModel');
const Booking = require('../Models/bookingModel');
const catchAsync = require(`../utils/catchAsync`);
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);

  if (!tour) return next(new AppError('No tour found with that ID', 404));
  // console.log('Success URL:', `${req.protocol}://${req.get('host')}`);
  // console.log('Cancel URL:', `${req.protocol}://${req.get('host')}/tour/${tour.slug}`);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourID}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
};

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it is insecure.
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) {
    // console.log("One or two or three criteria aren't right.");
    return next();
  }

  // console.log("This is where I'm suppose to create booking document");
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
