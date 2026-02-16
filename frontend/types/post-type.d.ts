export namespace PostProps {
  export interface PostType {
    id: string
    content: string
    createdAt: string
    rating: number
    userID: string
    userPost: UserPost
    movieName: string
    movie: Movie
    overview: string
    genreIDs: number[]
    imdbID: string
    likes: Like[]
    comments: Comment[]
  }

  export interface Movie {
  movieName: string
  movieImage: string
  overview: string
  genreIDs: number[]
  imdbID: string
  createdAt: string
  updatedAt: string
  id: string
  }

  export interface UserPost {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
  id: string
  }

  export interface Like {
  id: string
  postID: string
  userID: string
  }

  export interface Comment {
  id: string
  comment: string
  createdAt: string
  userID: string
  postID: string
  userComment: UserComment
  }

  export interface UserComment {
  firstName: string
  lastName: string
  createdAt: string
  }

  export interface createPost {
    content: string
    rating: number
    userID: string
    movieName: string
    movieImage: string
    overview: string
    genreIDs: number[]
    imdbID: string
  }
}