/**
 * Created by Suraj on 5/6/2017.
 */
var express = require('express');
var router = express.Router();
var Book = require('../modals/book');
var Cart = require('../modals/cart');
var Review = require('../modals/review');
var uuid = require('node-uuid');
var cartMain = "";
var cartCount = 0;

router.get('/', ensureAuthenticated,function(req, res){
    console.log("Logged In");
    //console.log(req.user);

    var bookList = "";

    Cart.getCart(req.user._id, function (err, cart) {

            req.cart = cart;
            cartMain = cart;
            //console.log(cart);

    });
    //console.log("Items in cart=================="+cartMain.length);
    Book.getBooks(function (err, books) {
        if(err) throw err;
        //console.log(books);
        bookList = books;
        //console.log(bookList);
        var len = false;
        if (bookList.length == 0){
            len = true;
        }
        if(cartMain){
            cartCount = cartMain.products.length;
        }
        res.render('shop',{
            user: req.user,
            books: bookList,
            len: len,
            cartcount: cartCount
        });
    });
});

router.post('/createBook',function (req,res) {
    var title = req.body.title;
    var author = req.body.author;
    var genre = req.body.genre;
    var isbn = req.body.isbn;
    var publisher = req.body.publisher;
    var price = req.body.price;
    var imagelink = req.body.imagelink;
    var totalRating = req.body.totalRating;

    var newBook = new Book({
        title: title,
        author: author,
        genre: genre,
        isbn: isbn,
        publisher: publisher,
        price: price,
        imagelink: imagelink,
        totalRating: totalRating
    });

    Book.createBook(newBook, function (err, book) {
        if(err) throw err;
        //console.log(book);
        res.send(book);
    });

});

router.post('/',function (req,res) {
    var filter = req.body.filter;
    var criteria = req.body.criteria;
    switch (criteria){
        case "genre":
            Book.getBooksByGenre(filter, function (err,books) {
                if(err) throw err;
                //console.log("==================="+books);
                var len = false;
                if (books.length == 0){
                    len = true;
                }
                res.render('shop',{
                    user: req.user,
                    books: books,
                    len: len,
                    cartcount: cartMain.products.length
                });
            });
            break;
        case "rating":
            Book.getBooksByRating(filter, function (err, books) {
                if (err) throw err;
                var len = false;
                if(books.length == 0){
                    len = true;
                }
                res.render('shop',{
                    user: req.user,
                    books: books,
                    len: len,
                    cartcount: cartMain.products.length
                });
            });
            break;
        default:
            Book.getBooksByCriteria(criteria, filter, function (err, books) {
                if(err) throw err;
                var len = false;
                if (books.length == 0){
                    len = true;
                }
                res.render('shop',{
                    user: req.user,
                    books: books,
                    len: len
                });
            });

    }
});

router.post('/addtocart', function (req, res) {
    //console.log(req.cart);
    Cart.addBookToCart(cartMain._id, req.body.bookId, function (err, cart) {
        if(err) throw err;
        setTimeout( function () {
            res.redirect(req.get('referer'));
        },2000);
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