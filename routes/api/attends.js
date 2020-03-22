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
router.post('/', async (req, response, next) => {

  // attend.create(req.body, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
  console.log("Attend,  " +pgConfig.pgConfig.user );
    const attend = req.body;
    const client = new Client(pgConfig.pgConfig);
    await client.connect();
    
    console.log("connected");
    client.query('INSERT INTO attends ( meal_id, user_id, status)' +
        'VALUES($1, $2, 0)',
        [attend.meal_id, attend.user_id])
    .catch(err => { console.log(err); return response.status(500).json("failed to attend"); })
    .then(answer => { return response.status(201).json(answer); });
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