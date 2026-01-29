export namespace MovieProps {
  export interface SearchMovieType {
    id: number,
    title: string,
    original_title: string,
    overview: string,
    poster_path: string,
    release_date: string
    genre_ids: number[]
    userID: string
  }
}