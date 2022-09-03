const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require("express");
const { promisify } = require('util');

const db = mysql.createConnection({
    host:       process.env.DATABASE_HOST, /**ip address of server*/
    user:       process.env.DATABASE_USER,
    password:   process.env.DATABASE_PASSWORD,
    database:   process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if( !email || !password ) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if( !results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                const cookieOptions = {
                    expiers: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIERS * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                
                res.cookie('jwt', token, cookieOptions );
                res.status(200).redirect("/");
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.reqister = (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if(error) {
            console.log(error);
        }
        if( result.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if( password !== passwordConfirm) {
            return res.render('register', {
                message: 'Password do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {firstName: firstName, lastName: lastName, email: email, password: hashedPassword }, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });
}

exports.isLoggedIn = async (req, res, next) => {
    req.message = "inside middleware";
    if( req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            console.log(decoded);
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
                console.log(result);

                if(!result) {
                    return next();
                }

                req.user = result[0];
                return next();
            });
        } catch (error) {
            return next();
        }
    } else {
        next();
    }
}

exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expirers: new Date(Date.now() + 2*1000),
        httpOnly: true
    });

    res.status(200).redirect('/')
}

exports.forgotPassword = async(req, res, next) => {
        const { email } = req.body;

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
        })
}