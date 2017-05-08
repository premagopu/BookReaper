/**
 * Created by Suraj on 5/7/2017.
 */
var express = require('express');
var router = express.Router();
var Book = require('../modals/book');
var Cart = require('../modals/cart');
var isbn = "";
var cartMain = "";
var cartCount = 0;

router.get('', ensureAuthenticated, function (req,res) {
    var p = req.query.isbn;
    var isbn = p;
    var ronline = false;
    Cart.getCart(req.user._id, function (err, cart) {
        req.cart = cart;
        cartMain = cart;
    });
    Book.getBookByISBN(req.query.isbn, function (err, book) {
        if (err) throw err;
        console.log(book);
        if(book.price == "0.00"){
            ronline = true;
        }
        if(cartMain){
            cartCount = cartMain.products.length;
        }
        res.render('book',{
            _id: book._id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            publisher: book.publisher,
            price: book.price,
            imagelink: book.imagelink,
            readOnline : ronline,
            cartcount: cartCount
        });
    });
});

function ensureAuthenticated (request, response, next){
    if(request.isAuthenticated()){
        return next();
    }else{
        response.render('home');
    }
};

module.exports = router;