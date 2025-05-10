const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../Models/tourModel');
const catchAsync = require(`../utils/catchAsync`);
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);

  if (!tour) return next(new AppError('No tour found with that ID', 404));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
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
