const { getPool } = require('../db');

function isValidMoviePayload(body) {
  const { title, director, releaseYear, genre } = body;
  if (!title || typeof title !== 'string') return false;
  if (!releaseYear || typeof releaseYear !== 'number') return false;
  if (director && typeof director !== 'string') return false;
  if (genre && typeof genre !== 'string') return false;
  return true;
}

exports.getAllMovies = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT id, title, director, releaseYear, genre FROM Movies ORDER BY id DESC');
    res.status(200).json(result.recordset);
  } catch (err) {
    next(err);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    const pool = await getPool();
    const result = await pool.request().input('id', id).query('SELECT id, title, director, releaseYear, genre FROM Movies WHERE id = @id');
    const movie = result.recordset[0];
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json(movie);
  } catch (err) {
    next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    if (!isValidMoviePayload(req.body)) {
      return res.status(400).json({ error: 'title (string) and releaseYear (number) are required' });
    }
    const { title, director, releaseYear, genre } = req.body;
    const pool = await getPool();
    const result = await pool
      .request()
      .input('title', title)
      .input('director', director || null)
      .input('releaseYear', releaseYear)
      .input('genre', genre || null)
      .query(
        'INSERT INTO Movies (title, director, releaseYear, genre) OUTPUT INSERTED.id, INSERTED.title, INSERTED.director, INSERTED.releaseYear, INSERTED.genre VALUES (@title, @director, @releaseYear, @genre)'
      );
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    if (!isValidMoviePayload(req.body)) {
      return res.status(400).json({ error: 'title (string) and releaseYear (number) are required' });
    }
    const { title, director, releaseYear, genre } = req.body;
    const pool = await getPool();

    const existing = await pool.request().input('id', id).query('SELECT id FROM Movies WHERE id = @id');
    if (existing.recordset.length === 0) return res.status(404).json({ error: 'Movie not found' });

    const result = await pool
      .request()
      .input('id', id)
      .input('title', title)
      .input('director', director || null)
      .input('releaseYear', releaseYear)
      .input('genre', genre || null)
      .query(
        'UPDATE Movies SET title = @title, director = @director, releaseYear = @releaseYear, genre = @genre WHERE id = @id; SELECT id, title, director, releaseYear, genre FROM Movies WHERE id = @id;'
      );

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
};

