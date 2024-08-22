import crypto from 'crypto';
import { validatePartialMovie, validateMovie } from "../schemas/movieSchema.js";
import movies from "../data/movies.json" assert { type: "json" };


export const getMovies = async (req, res) => {
  try {
    const { genre } = req.query;      // Obtiene el parametro 'genre' de la query, si no existe, es decir que no hay query, y se devuelven todas
    if (genre) {
      // const filteredMovies = movies.filter(movie => movie.genre.includes(genre));
      const filteredMovies = movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())           // Para ser case sensitive
      );
      return res.json(filteredMovies);
    };

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    const movie = movies.find(movie => movie.id === id);
    
    if (movie) {
      return res.json(movie);
    };
  
    res.status(404).json({ message: "Movie not found" }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveMovie = async (req, res) => {
  try {
    const result = validateMovie(req.body);

    if (result.error) {
      return res.status(404).json({ error: JSON.parse(result.error.message) });
    };

    const id = crypto.randomUUID();
    const movie = {
      id,
      ...result.data
    };

    movies.push(movie);

    res.status(201).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(404).json({ error: JSON.parse(result.error.message) });
    }

    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const updatedMovie = {
      ...movies[movieIndex],
      ...result.data
    };

    movies[movieIndex] = updatedMovie;

    return res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
