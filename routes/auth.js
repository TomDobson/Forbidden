const express = require('express');
const jwt = require('jsonwebtoken')
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.reqister);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

//****Password reset****//
router.post('/forgot-password', authController.forgotPassword);


router.get('/reset-password', (req, res, next) => {

})

router.post('/reset-password', (req, res, next) => {

})

module.exports = router;