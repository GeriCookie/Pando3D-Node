var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Strategy = require('passport-http-bearer'),
    cors = require('cors');

passport.use(new Strategy(
    function(token, done) {
        User.findOne({
            token: token
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user, {
                scope: 'all'
            });
        });
    }
));

var db = mongoose.connect('mongodb://localhost/pando3d');

var User = require('./models/userModel');
var Project = require('./models/projectModel');
var app = express();

var port = process.env.Port || 3000;

app.use('/', express.static(__dirname + '/public'));
app.use(cors());

app.use(bodyParser.json());

var userRouter = require('./Routes/userRoutes')(User);
//var projectRouter = require('./Routes/projectRoutes')(User, Project);

app.use('/api/users', userRouter);
//app.use('/api/projects', projectRouter);

app.listen(port, function() {
    console.log('Running on PORT: ' + port);
});
module.exports = app;
