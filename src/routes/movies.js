const { Router } = require('express');
const router = Router();

const moviesController = require('../controllers/moviesController');
const reviewsController = require('../controllers/reviewsController');

router.get('/', moviesController.getAllMovies);
router.get('/:id', moviesController.getMovieById);
router.post('/', moviesController.createMovie);
router.put('/:id', moviesController.updateMovie);

router.post('/:id/reviews', reviewsController.createReviewForMovie);
router.get('/:id/reviews', reviewsController.getReviewsForMovie);

module.exports = router;

