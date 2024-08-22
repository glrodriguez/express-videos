import zod from 'zod';


export const movieSchema = zod.object({
  title: zod.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: zod.number().int().min(1900).max(2024),
  director: zod.string(),
  duration: zod.number().int().positive(),
  genre: zod.array(
    zod.enum(['Action', 'Drama', 'Adventure', 'Comedy', 'Crime', 'Animation', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi'])
  ),
  rate: zod.number().optional()
});

export const validatePartialMovie = (movie) => movieSchema.partial().safeParse(movie);

export const validateMovie = (movie) => movieSchema.safeParse(movie);
