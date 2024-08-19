import {z} from 'zod'

const movieSchema = z.object({
    title: z.string({
      invalid_type_error: 'Movie title must be a string',
      required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
      message: 'Poster must be a valid URL'
    }),
    genre: z.array(
      z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi', 'Romance']),
      {
        required_error: 'Movie genre is required.',
        invalid_type_error: 'Movie genre must be an array of enum Genre'
      }
    )
  })


export function validationMovie(object) {
  return movieSchema.safeParse(object)
}
export function validationPartial(input) {
  return movieSchema.partial().safeParse(input)
}