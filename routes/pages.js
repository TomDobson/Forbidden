const express = require('express');

const { homeCtrlFunction, cartCtrlFunction, registerCtrlFunction, loginCtrlFunction, profileCtrlFunction } = require('../controllers/pagesCtrlFile');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authController.isLoggedIn, homeCtrlFunction);
router.get('/cart', authController.isLoggedIn, cartCtrlFunction);
router.get('/register', authController.isLoggedIn, registerCtrlFunction);
router.get('/login', authController.isLoggedIn, loginCtrlFunction);
router.get('/profile', authController.isLoggedIn, profileCtrlFunction);

module.exports = router;

// router.get('/register', (req, res) => {
//     res.render('register');
// });

// router.get('/login', (req, res) => {
//     res.render('login');
// });

// router.get('/cart', (req, res) => {
//     res.render('cart');
// })

// router.get('/forgot-password', (req, res) => {
//     res.render('forgot-password');
// })

// router.get('/profile', homeCtrlFunction.isLoggedIn, (req, res) => {
//     if(req.user) {
//         res.render('profile', {
//             user: req.user
//         });
//     } else {
//         res.redirect('/login');
//     } 
// });
