import axios from 'axios';
import { showAlert } from './alerts';
// import Stripe from 'stripe';
const stripe = Stripe(
  'pk_test_51PDyZgQWTnNh4ZzFHLdarWnhOhEaGiJeYXiSPGwVEV2VtgbuzY7krfsGFsq5CDChyANLiS1qtEOyg4ndYD2uzYET005LZg5CpO',
); //public key

export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //2) Create Checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
