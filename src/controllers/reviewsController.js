const { getPool } = require('../db');

function isValidReviewPayload(body) {
  const { reviewAuthor, reviewText, rating } = body;
  if (!reviewAuthor || typeof reviewAuthor !== 'string') return false;
  if (!reviewText || typeof reviewText !== 'string') return false;
  if (rating === undefined || !Number.isInteger(rating) || rating < 1 || rating > 5) return false;
  return true;
}

exports.createReviewForMovie = async (req, res, next) => {
  try {
    const movieId = Number(req.params.id);
    if (!Number.isInteger(movieId)) return res.status(400).json({ error: 'Invalid movie id' });
    if (!isValidReviewPayload(req.body)) {
      return res.status(400).json({ error: 'reviewAuthor, reviewText (string) and rating (1-5 int) are required' });
    }
    const { reviewAuthor, reviewText, rating } = req.body;

    const pool = await getPool();
    const movieCheck = await pool.request().input('id', movieId).query('SELECT id FROM Movies WHERE id = @id');
    if (movieCheck.recordset.length === 0) return res.status(404).json({ error: 'Movie not found' });

    const result = await pool
      .request()
      .input('movieId', movieId)
      .input('reviewAuthor', reviewAuthor)
      .input('reviewText', reviewText)
      .input('rating', rating)
      .query(
        'INSERT INTO Reviews (movieId, reviewAuthor, reviewText, rating) OUTPUT INSERTED.id, INSERTED.movieId, INSERTED.reviewAuthor, INSERTED.reviewText, INSERTED.rating VALUES (@movieId, @reviewAuthor, @reviewText, @rating)'
      );

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
};

exports.getReviewsForMovie = async (req, res, next) => {
  try {
    const movieId = Number(req.params.id);
    if (!Number.isInteger(movieId)) return res.status(400).json({ error: 'Invalid movie id' });
    const pool = await getPool();
    const movieCheck = await pool.request().input('id', movieId).query('SELECT id FROM Movies WHERE id = @id');
    if (movieCheck.recordset.length === 0) return res.status(404).json({ error: 'Movie not found' });

    const result = await pool
      .request()
      .input('movieId', movieId)
      .query('SELECT id, movieId, reviewAuthor, reviewText, rating FROM Reviews WHERE movieId = @movieId ORDER BY id DESC');
    res.status(200).json(result.recordset);
  } catch (err) {
    next(err);
  }
};

