var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var attend = require('../../models/Attend.js');

/* GET ALL attends */
router.get('/', function(req, res, next) {
  attend.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE attend BY ID */
router.get('/:id', function(req, res, next) {
  attend.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET sattend by meal */
router.get('/meal/:meal_id', function(req, res, next) {
  attend.find({meal_id:req.params.meal_id}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE attend */
router.post('/', function(req, res, next) {
  attend.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE attend */
router.put('/:id', function(req, res, next) {
  attend.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE attend */
router.delete('/:id', function(req, res, next) {
  attend.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;