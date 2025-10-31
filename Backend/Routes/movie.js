import express from 'express'
import { getMovie ,currentMovies,getSingleMovie,deleteMovie} from '../controller/movieController.js';

const movieRouter=express.Router();

movieRouter.get('/getmovie',getMovie)
movieRouter.get('/getsinglemovie/:id',getSingleMovie)
movieRouter.get('/currentMovie',currentMovies)
movieRouter.delete('/:id', deleteMovie);


export default movieRouter