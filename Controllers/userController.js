require('../polyfills/array');
var userController = function(User) {
    var post = function(req, res) {
        var username = req.body.username,
            passHash = req.body.passHash,
            image = req.body.image,
            query = {
                username: username.toLowerCase()
            };

        User.findOne(query, function(err, user) {
            if (err) {
                throw err;
            }

            if (user) {
                res.status(400).json({
                    err: 'Already such user'
                });
                return;
            }

            var user2 = new User({
                username: username.toLowerCase(),
                nickname: username,
                passHash: passHash,
                image: image,
                token: (function(username) {
                    var len = 60,
                        chars = '0123456789',
                        token = username;
                    while (token.length < len) {
                        token += chars[(Math.random() * chars.length) | 0];
                    }
                    return token;
                }(username))
            });

            user2.save(function(err, user) {
                if (err) {
                    throw err;
                }
                res.status(201).json({
                    username: user.nickname,
                    token: user.token,
                    userId: user._id
                });
            });
        });
    };

    var get = function(req, res) {
        User.find().then(function(users) {
            res.json(users);
        });
    };

    return {
        post: post,
        get: get
    };
};

module.exports = userController;
