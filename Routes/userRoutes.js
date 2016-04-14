var express = require('express'),
    passport = require('passport');

var routes = function(User) {
    var userRouter = express.Router();

    var userController = require('../Controllers/userController')(User);

    userRouter.route('/')
        .post(userController.post)
        .get(userController.get);

    userRouter.route('/auth')
        .put(function(req, res) {
            var username = req.body.username,
                passHash = req.body.passHash,
                query = {
                    username: username.toLowerCase()
                };

            User.findOne(query, function(err, user) {
                if (err) {
                    throw err;
                } else if (user === null) {
                    res.status(404).json({
                        message: 'Invalid username or password'
                    });

                } else if (user.passHash === passHash) {
                    var userSend = {
                        username: user.nickname,
                        token: user.token,
                        userId: user._id
                    };

                    res.json(userSend);
                } else {
                    res.status(404).json({
                        message: 'Invalid username or password'
                    });
                }
            });
        });

    userRouter.get('/:userId', passport.authenticate('bearer', {
            session: false
        }),
        function(req, res) {
            User.findById(req.params.userId, function(err, user) {
                if (err) {
                    res.status(500).send(err);
                } else if (user) {
                    res.json({
                        nickname: user.nickname,
                        favoriteQuotes: user.favoriteQuotes,
                        friends: user.friends,
                        userImageUrl: user.userImageUrl
                    });
                } else {
                    res.status(404).send('no user found');
                }
            });
        });


    return userRouter;
};
module.exports = routes;
