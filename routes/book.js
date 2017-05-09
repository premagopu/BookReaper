/**
 * Created by Suraj on 5/7/2017.
 */
var express = require('express');
var router = express.Router();
var Book = require('../modals/book');
var Cart = require('../modals/cart');
var Review = require('../modals/review');
var isbn = "";
var cartMain = "";
var cartCount = 0;
var user = "";

router.get('', ensureAuthenticated, function (req,res) {
    var p = req.query.isbn;
    var isbn = p;
    var ronline = false;
    user = req.user;
    Cart.getCart(req.user._id, function (err, cart) {
        req.cart = cart;
        cartMain = cart;
    });
    Book.getBookByISBN(req.query.isbn, function (err, book) {
        if (err) throw err;
        //console.log(book);
        if(book.price == "0.00"){
            ronline = true;
        }
        if(cartMain){
            cartCount = cartMain.products.length;
        }
        updateRating(req.query.isbn,book);
        res.render('book',{
            _id: book._id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            publisher: book.publisher,
            price: book.price,
            imagelink: book.imagelink,
            reviews: book.reviews,
            readOnline : ronline,
            cartcount: cartCount
        });
    });
});

router.post('/review', function (req, res) {
    var newReview = new Review({
        comment: req.body.reviewComment,
        rating: req.body.rating,
        reviewBy: user.username
    });
    //console.log("new review====="+user.username);
    Book.addReviewByISBN(req.body.isbn, newReview, function (err, book) {
        if (err) throw err;
        updateRating(req.body.isbn,book);
    });

    res.redirect(req.get('referer'));
});

function ensureAuthenticated (request, response, next){
    if(request.isAuthenticated()){
        return next();
    }else{
        response.render('home');
    }
};

function updateRating(isbn, book) {
    var overallRating = 5;
    if(book.reviews.length > 0){
        var noOfReviews = book.reviews.length;
        var totalRating = 0;
        for(var i=0; i<noOfReviews;i++){
            totalRating = totalRating + book.reviews[i].rating;
        }
        overallRating = Math.round(totalRating/noOfReviews);
    }
    Book.updateTotalRating(overallRating,isbn, function (err, book) {
        if (err) throw err;
    });

}

module.exports = router;