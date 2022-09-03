exports.homeCtrlFunction = (req, res) => {
    res.render('index', {
        user: req.user
    });
}

exports.cartCtrlFunction = (req, res) => {
    res.render('cart', {
        user: req.user
    });
}

exports.registerCtrlFunction = (req, res) => {
    res.render('register');
}

exports.loginCtrlFunction = (req, res) => {
    res.render('login');
}

exports.profileCtrlFunction = (req, res) => {
    if(req.user) {
        res.render('profile', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }
}