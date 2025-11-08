import express from 'express'
import { getMovie ,currentMovies,getSingleMovie,removeMovieFromGroup} from '../controller/movieController.js';

const movieRouter=express.Router();

movieRouter.get('/getmovie',getMovie)
movieRouter.get('/getsinglemovie/:id',getSingleMovie)
movieRouter.get('/currentMovie',currentMovies)
movieRouter.delete('/:groupId/:movieId', removeMovieFromGroup);



export default movieRouter