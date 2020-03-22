var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var attend = require('../../models/Attend.js');
const pgConfig=require("./../dbConfig.js");
const {Client}=require("pg");

// /* GET ALL attends */
// router.get('/', function(req, res, next) {
//   attend.find(function (err, products) {
//     if (err) return next(err);
//     res.json(products);
//   });
// });

// /* GET SINGLE attend BY ID */
// router.get('/:id', function(req, res, next) {
//   attend.findById(req.params.id, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

/* GET attend by meal */
router.get('/meal/:meal_id', function(req, res, next) {
  attend.find({meal_id:req.params.meal_id}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE attend */
router.post('/', function(req, res, next) {

  // attend.create(req.body, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
  console.log("Attend,  " +pgConfig.pgConfig.user );
    const attend = req.body;
    const client = new Client(pgConfig.pgConfig);
    client.connect();
    
    console.log("connected");
    client.query('INSERT INTO attends ( meal_id, user_id)' +
        'VALUES($1, $2)',
        [attend.user, attend.meal_id]);
    // TODO: fix user id
    
    // }
    // catch(e)
    // {
    //   console.log("exception catched: " + e);
    // }
    console.log("query attend done");
    client.end();
    return response.status(201).json(req.body);
});

// /* UPDATE attend */
// router.put('/:id', function(req, res, next) {
//   attend.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

/* DELETE attend */
router.delete('/:id', function(req, res, next) {
  attend.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;