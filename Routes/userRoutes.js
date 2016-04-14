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

    userRouter.put('/:userId', passport.authenticate('bearer', {
        session: false
    }), function(req, res) {
        var currentUser = req.user;
        User.findById(req.params.userId, function(err, user) {
            if (err) {
                res.status(500).send(err);
            } else if (user) {
                if (!user.friends) {
                    user.friends = [];
                }

                if (user._id.toString() === currentUser._id.toString()) {
                    res.status(500).send({
                        message: "You cannot add yourself to friends"
                    });
                }

                var index = user.friends.findIndex(function(friend) {
                    return friend.userId.toString() == currentUser._id.toString();
                });
                console.log(index);
                if (index >= 0) {
                    res.json({
                        username: user.nickname,
                        userId: user._id,
                        friends: user.friends
                    });
                } else {
                    user.friends.push({
                        userId: currentUser._id,
                        username: currentUser.nickname
                    });

                    currentUser.friends.push({
                        userId: user._id,
                        username: user.nickname
                    });

                    currentUser.save();

                    user.save(function() {
                        res.json({
                            username: user.nickname,
                            userId: user._id,
                            friends: user.friends
                        });
                    });
                }
            } else {
                res.status(404).send('no user found');
            }
        });
    });
    return userRouter;
};
module.exports = routes;
