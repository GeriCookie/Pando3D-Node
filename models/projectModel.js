var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var projectModel = new Schema({
    shapeName: {
        type: String,
        required: true
    },
    color: String,
    dimentionX: Number,
    dimentionY: Number,
    dimensionZ: Number,
    shapeForm: String,
    lastInteraction: Date,
    status: String,
    notes: [Schema.Types.Mixed],
    author: [Schema.Types.Mixed],
    createdOn: Date
});

module.exports = mongoose.model('Project', projectModel);
