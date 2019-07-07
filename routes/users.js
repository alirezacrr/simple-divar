var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var flash = require('connect-flash');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.use(flash());

router.get('/register', function (req, res, next) {

    res.render('register', {
        title: 'register',
        message: req.flash('error')
    });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/users/register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));
// LOCAL SIGNUP ============================================================
passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        emailField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, username, password, done) {
        //  Whether we're signing up or connecting an account, we'll need
        //  to know if the email address is in use.
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.rePassword;
        User.findOne({
            username: {
                "$regex": "^" + username + "\\b", "$options": "i"
            }
        }, function (err, user) {
            // check to see if there's already a user with that email
            if (user)
                return done(null, false, req.flash('error', 'That username is already taken.'));
            else {
                if (password === password2) {
                    // create the user
                    var newUser = new User({
                        email: email,
                        username: username,
                        password: password
                    });
                    User.createUser(newUser, function (err, user) {
                        if (err) throw err;
                        console.log(user);
                    });
                    newUser.save().then(function () {
                        done(null, newUser);
                    }).catch(function (err) {
                        done(null, false, req.flash('error', err));
                    });
                } else {
                    return done(null, false, req.flash('error', 'password not match'));
                }

            }
        })
            .catch(function (e) {
                done(null, false, req.flash('loginMessage', e.name + " " + e.message));
            })

    }));
passport.use(new LocalStrategy(
    function (username, password, cb) {
        User.getUserByUsername(username, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false, {message: 'Invalid username ' + username});
            }
            // else {
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return cb(null, user);
                } else {
                    return cb(null, false, {message: 'Invalid password'});
                }
            });
            // }
            // return cb(null, user);
            // User.comparePassword(password, user.password, function (err, isMatch) {
            //     if (err) throw err;
            //     if (isMatch) {
            //         return done(null, user);
            //     } else {
            //         return done(null, false, {message: 'Invalid password'});
            //     }
            // });
        });
    }));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});
router.get('/login',
    function (req, res) {
        res.render('register', {
            title: 'login',
            message: req.flash('error')
        });
    });
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/', failureRedirect: '/users/login', failureFlash: true
    }),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    });
router.post('/bookmark', function (req, res, next) {
    var bookmark = req.user.bookmark;
    if (bookmark.includes(req.body.id)) {
        User.removeBookmark(bookmark, req.body.id, req.user);
        res.json({status: false})
    } else {
        User.bookmark(bookmark, req.body.id, req.user);
        res.json({status: true})
    }
});

module.exports = router;
