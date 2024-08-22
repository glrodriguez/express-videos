import { Router } from "express";
import { getMovies, getMovieById, saveMovie, updateMovie } from "../controllers/moviesController.js";


const movieRouter = Router();

movieRouter.get('/', getMovies);
movieRouter.get('/:id', getMovieById);

movieRouter.post('/', saveMovie);

movieRouter.patch('/:id', updateMovie);

export default movieRouter;
