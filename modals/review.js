/**
 * Created by Suraj on 5/4/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = Schema({
    comment:{
        type: String
    },
    rating:{
        type: Number
    },
    reviewBy:{
        type: mongoose.Schema.Types.ObjectId,
        referenceBy: 'User'
    }
});

var Review = module.exports = mongoose.model('Review', reviewSchema);

