import { z } from "zod"

const ValidatePost = {
  validateCreatePost: z.object({
    content: z.string(),
    rating: z.number(),
    // userID: z.string(),
    movieName: z.string(),
    movieImage: z.string(),
    overview: z.string(),
    genreIDs: z.array(z.number()),
    imdbID: z.string()
  }),
  validateUpdatePost: z.object({
    content: z.string(),
    rating: z.number(),
  })
}

export type ValidateCreatePost = z.infer <typeof ValidatePost["validateCreatePost"]>
export type ValidateUpdatePost = z.infer <typeof ValidatePost["validateUpdatePost"]>
export default ValidatePost