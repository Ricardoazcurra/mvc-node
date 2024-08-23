import { validationMovie, validationPartial } from '../schemas/movies.js'

export class MovieController {
    constructor ({MovieModel}){
        this.MovieModel = MovieModel
    }

    getAll = async (req, res) => {
        const { genre } = req.query
        const movies = await this.MovieModel.getAll({ genre })
        res.json(movies)
    }

    getById = async (req, res) => {
        const {id} = req.params
        const movi = await this.MovieModel.getById({id})
        
        if (movi) return res.json(movi)
    
        res.status(404).json({message: 'Movie not found'})
    }

    create = async (req,res) => {

        const result = validationMovie(req.body)
        
        if(result.error){
            return res.status(402).json({error: JSON.parse(result.error.message)})  
        } 
        //dejamos pasar result porque son los datos realmente validados
        const newMovie =  await this.MovieModel.create(result)
    
        res.status(201).json(newMovie)
    }

    delete = async (req,res) => {
        const {id} = req.params
        const movieIndex = await this.MovieModel.delete({id})
    
        if(!movieIndex) return res.status(404).json({message: 'Movie not found'})
    
        return res.json({message: 'Movie deleted'})
    }

    update = async (req, res) => {
        const result = validationPartial(req.body)
    
        if(result.error){
            return res.status(402).json({error: JSON.parse(result.error.message)})  
        } 
        const {id} = req.params
        const updateMovie = await this.MovieModel.update({id, data: result.data})
    
        if (updateMovie === false) return res.status(404).json({message: 'Movie not found'})
    
        return res.json(updateMovie)
    }
}