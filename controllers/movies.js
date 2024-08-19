import { MovieModel } from "../models/movie.js"
import { validationMovie, validationPartial } from '../schemas/movies.js'

export class MovieController {
    static async getAll(req, res) {
        const { genre } = req.query
        const movies = await MovieModel.getAll({ genre })
        res.json(movies)
    }

    static async getById(req, res) {
        const {id} = req.params
        const movi = await MovieModel.getById({id})
        
        if (movi) return res.json(movi)
    
        res.status(404).json({message: 'Movie not found'})
    }

    static async create(req,res) {

        const result = validationMovie(req.body)
        
        if(result.error){
            return res.status(402).json({error: JSON.parse(result.error.message)})  
        } 
        //dejamos pasar result porque son los datos realmente validados
        const newMovie =  await MovieModel.create(result)
    
        res.status(201).json(newMovie)
    }

    static async delete(req,res) {
        const {id} = req.params
        const movieIndex = await MovieModel.delete({id})
    
        if(!movieIndex) return res.status(404).json({message: 'Movie not found'})
    
        return res.json({message: 'Movie deleted'})
    }

    static async update(req, res) {
        const result = validationPartial(req.body)
    
        if(result.error){
            return res.status(402).json({error: JSON.parse(result.error.message)})  
        } 
        const {id} = req.params
        const updateMovie = await MovieModel.update({id, data: result.data})
    
        if (updateMovie === false) return res.status(404).json({message: 'Movie not found'})
    
        return res.json(updateMovie)
    }
}