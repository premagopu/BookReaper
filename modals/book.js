/**
 * Created by Suraj on 5/4/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var review = require('./review');

var bookSchema = Schema({
    title:{
        type: String
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
    reviews:[review]
});

var Book = module.exports = mongoose.model('Book', bookSchema);

module.exports.createBook = function (newBook, callback) {
    newBook.save(callback);
};

module.exports.getBookByISBN = function (isbn, callback) {
      var query = {ISBN : isbn};
      Book.findOne(query);
};

module.exports.getBookByTitle = function (title, callback) {
    var query = {title : title};
    Book.find(query);
};

module.exports.getBooksByAuthor = function (author, callback) {
    var query = {author : author};
    Book.find(query);
};

module.exports.getBooksByGenre = function (genre, callback) {
    var query = {genre : genre};
    Book.find(query);
};

module.exports.getBooksByPublisher = function (publisher, callback) {
    var query = {publisher : publisher};
    Book.find(query);
};