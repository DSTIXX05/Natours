/* eslint-disable import/extensions */
const express = require('express');
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');

const router = express.Router();
// router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', viewController.getLoginForm);
router.get('/tour', authController.isLoggedIn, viewController.getTour);

router.get('/me', authController.protect,authController.isLoggedIn, viewController.getAccount);

// router.post('/submit-user-data',  authController.isLoggedIn, authController.protect, viewController.updateUserData);
// router.post('/submit-user-data', viewController.getAccount);

module.exports = router;
