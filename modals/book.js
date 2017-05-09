/**
 * Created by Suraj on 5/4/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var review = require('./review');

var bookSchema = Schema({
    title:{
        type: String,
        index: true
    },
    author:{
        type: String
    },
    genre:{
        type: String
    },
    isbn:{
        type: String
    },
    publisher:{
        type: String
    },
    imagelink:{
        type: String
    },
    price:{
        type: String
    },
    reviews:[{
        comment:{
            type: String
        },
        rating:{
            type: Number
        },
        reviewBy:{
            type: String
        }
    }],
    totalRating:{
        type: Number
    }
});

var Book = module.exports = mongoose.model('Book', bookSchema);

module.exports.createBook = function (newBook, callback) {
    newBook.save(callback);
};

module.exports.getBookByISBN = function (isbn, callback) {
      var query = {isbn : isbn};
      Book.findOne(query,callback);
};

module.exports.getBookByTitle = function (title, callback) {
    var query = {title : title};
    Book.find(query,callback);
};

module.exports.getBooksByAuthor = function (author, callback) {
    var query = {author : author};
    Book.find(query,callback);
};

module.exports.getBooksByGenre = function (genre, callback) {
    var query = {genre : genre};
    Book.find(query,callback);
};

module.exports.getBooksByRating = function (rating, callback) {
    var query = {totalRating : rating};
    Book.find(query,callback);
};

module.exports.getBooksByPublisher = function (publisher, callback) {
    var query = {publisher : publisher};
    Book.find(query,callback);
};

module.exports.addReviewByISBN = function (isbn, newReview, callback) {
    var query = {isbn: isbn};
    //console.log(newReview);
    Book.findOne(query, callback).exec(function (err, book) {
        //console.log(book);
        book.reviews.push(newReview);
        book.save(function (err) {
            if (!err){
                Book.find({})
                    .populate('reviews')
                    .populate('reviews.comment')
                    .populate('reviews.rating')
                    .populate('reviews.reviewBy').exec(function (err, book) {
                        //console.log(book);
                })
            }
        }, callback);
    });
};

module.exports.getBooks = function (callback) {

    var books= Book.find(callback);
    //console.log(books);
};

module.exports.getBooksByCriteria = function (criteria, keyword, callback) {
    var query = {};

    switch (criteria){
        case "title":
            query ={title: keyword};
            break;
        case "author":
            query ={author: keyword};
            break;
        case "publisher":
            query ={publisher: keyword};
            break;
        case "isbn":
            query ={isbn: keyword};
            break;
    }
    Book.find(query, callback);

};

module.exports.updateTotalRating = function (rating, isbn, callback) {
    Book.update({"isbn":isbn},{$set:{ "totalRating": rating}},callback);
};