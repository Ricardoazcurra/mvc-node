import express, { json } from 'express'
import {corsMiddleware} from './midleware/cors.js'
import {readJSON} from './utils.js'
import { routerMovie } from './routes/movies.js'

const movies = readJSON('./movies.json')

const app = express()

//deshabilitamos cabecera y llamamos puerto
app.disable('x-powered-by')
app.use(json()) 
app.use(corsMiddleware())

// lo que vamos a hacer es cargar todo el enrutador de movies cuando se use la ruta movie
app.use('/movies', routerMovie)



const PORT = process.env.PORT ?? 1234


//asi levantamos el server en el puerto determinado
app.listen(PORT,()=>{
    console.log(`SERVER LISTENING ON POR http://localhost:${PORT}`)
})