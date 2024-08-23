import mysql from 'mysql2/promise'

const config = {
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    password: 'Ricardo2319*',
    database: 'movies-database'
}

const conection = await mysql.createConnection(config)

export class MovieModel {
    static async getAll({genre}){
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase()

            const [genres] = await conection.query('SELECT id, name FROM genres WHERE LOWER(name) = ?', [lowerCaseGenre])

            //NOT genres 
            if(genres.length === 0) return []

            //get firs element of genres
            const [{ id }] = genres

 
            const [movies] = await conection.query(`
                SELECT 
                  m.title, 
                  m.year, 
                  m.director, 
                  m.duration, 
                  m.poster, 
                  m.rate, 
                  BIN_TO_UUID(m.id) AS id, 
                  g.name AS genre 
                FROM 
                  movies AS m
                LEFT JOIN 
                  movie_genres AS mg ON m.id = mg.movie_id
                LEFT JOIN 
                  genres AS g ON mg.genre_id = g.id 
                WHERE 
                  g.id = ?
              `, [id]);


            return movies
        }

       const [movies] = await conection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) AS id FROM movies')
       return movies
    }

    static async getById({id}){
        const [movie] = await conection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) AS id FROM movies WHERE id = UUID_TO_BIN(?) ', [id])
    
        if (movie.length === 0) return null
        
        return movie[0]
    }

    static async create({data}){
        const {title, year, director, duration, poster, rate} = data
        const [uuidResult] = await conection.query('SELECT UUID() uuid;')

        const [{uuid}] = uuidResult
       
        try { 
            await conection.query(`INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN("${uuid}"),?,?, ?, ?, ?, ?)`, [title, year, director, duration, poster, rate])
            
        } catch (error) {
            console.log(error)
            new Error('Movie not created')   
        }
        
        const [movie] = await conection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) AS id FROM movies WHERE id = UUID_TO_BIN(?) ', [uuid])
    
        return movie[0]
    
    }

    static async delete({id}){
        const [movie] = await conection.query('SELECT id FROM movies WHERE id = UUID_TO_BIN(?)', [id])
        
        if (movie.length === 0) return false
        
        try {    
            await conection.query('DELETE FROM movies WHERE id = UUID_TO_BIN(?) ', [id])
        } catch (error) {
            new Error('Movie not deleted')
        }
        return true
    }

    static async update({ id, data }) {
        const { title, year, director, duration, poster, rate } = data;
    
        // Buscar la película por ID
        const [movie] = await conection.query(
            'SELECT BIN_TO_UUID(id) AS id FROM movies WHERE id = UUID_TO_BIN(?)',
            [id]
        );
    
        if (movie.length === 0) return false; // Si no se encuentra la película, retorna false
    
        // Actualizar la película
        try {
            await conection.query(
                'UPDATE movies SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = UUID_TO_BIN(?)',
                [title, year, director, duration, poster, rate, id]
            );
        } catch (error) {
            console.error('Error updating movie:', error);
            throw new Error('Movie not updated');
        }
    
        // Obtener la película actualizada
        const [updateMovie] = await conection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) AS id FROM movies WHERE id = UUID_TO_BIN(?)',
            [id]
        );
    
        return updateMovie[0] || null; // Retorna la película actualizada o null si no se encuentra
    }
}