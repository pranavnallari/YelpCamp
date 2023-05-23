const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const {validateReview,isLoggedIn,isReview} = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/',isLoggedIn, validateReview,reviews.createReview)

router.delete('/:reviewId',isLoggedIn,isReview,catchAsync(reviews.deleteReview))

module.exports = router;