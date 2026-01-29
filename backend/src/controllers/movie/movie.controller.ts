import { Request, Response, NextFunction } from "express";
import axios from "axios";

export default {
  searchMovie: async (req: Request, res: Response, next: NextFunction) => {
    const tmdbUrl = process.env.TMDB_URL as string
    const tmdbToken = process.env.TMDB_TOKEN as string
    try {
      const { query } = req.query
      
      const result = await axios.get(tmdbUrl, {
        params: {
          query: query
        },
        headers: {
          Authorization: `Bearer ${tmdbToken}`,
          accept: 'application/json'
        }
      })

      res.status(200).json( result.data )
    } catch (error) {
      next(error)
    }
  }
}