/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String]
});

const BookModel = mongoose.model('Book', BookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await BookModel.find({});
        res.json(books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length 
        })));
      } catch (err) {
        res.status(500).send('Server Error');
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.send('missing required field title');
      }
      try {
        const newBook = new BookModel({ title });
        const savedBook = await newBook.save();
        res.json({ _id: savedBook._id, title: savedBook.title, commentcount: 0 });
      } catch (err) {
        res.status(500).send('Server Error');
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        await BookModel.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await BookModel.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.send('missing required field comment');
      }
      try {
        const book = await BookModel.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment } },
          { new: true }
        );
        if (!book) {
          return res.send('no book exists');
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const result = await BookModel.findByIdAndDelete(bookid);
        if (!result) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
  
};
