import { Request, Response, NextFunction } from "express"
import { ValidateCreatePost } from "./post.validator"
import { prisma } from "../../database/src/cilent"
import { Prisma } from "@prisma/client"
import { UtilsHelpers } from "../../helpers/helper"
import { Filter } from "../utils/filter"

import { io } from "../../index"
import { redisClient } from "../../helpers/redis"

const clearPostCache = async () => {
  try {
    const keys = await redisClient.keys('posts:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("Redis Cache Clear Error", err);
  }
}

export default {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        content,
        rating, 
        movieName, 
        movieImage, 
        overview, 
        genreIDs, 
        imdbID 
      } = req.body as ValidateCreatePost

      const userID = res.locals.user.id

      const result = await prisma.$transaction(async (tx) => {
        
        const existingMovie = await tx.movie.findUnique({
          where: { imdbID }
        })

        if (existingMovie) {
          const createdPost = await tx.post.create({
            data: {
              content,
              rating,
              userID: userID,
              movieID: existingMovie.id
            },
            include: {
              user: true,
              movie: true
            }
          })
          return createdPost
        } else {
          const createdMovie = await tx.movie.create({
          data: {
            movieName, 
            movieImage, 
            overview, 
            genreIDs, 
            imdbID
          }
        })
         
          const createdPost = await tx.post.create({
            data: {
              content,
              rating,
              userID: userID,
              movieID: createdMovie.id
            },
            include: {
              user: true,
              movie: true
            }
          })
          return createdPost
        }
      })

      const payload = {
        ...result,
        userPost: result.user,
        comments: [],
        likes: []  
      }

      io.emit("post:created", payload)
      await clearPostCache()
      res.status(201).json({ result: payload })
    } catch (error) {
      next(error)
    }
  },
  updatedPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { content, rating } = req.body

      const result = await prisma.$transaction(async (tx) => {
        const updatedPost = await tx.post.update({
          where: { id: id },
          data: {
            content,
            rating
          }
        })
        return updatedPost
      })

      io.emit("post:updated", result)
      await clearPostCache()
      res.status(201).json({ message: "Update successfully.", result })
    } catch (error) {
      next(error)
    }
  },
  getAllPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheKey = `posts:all:${JSON.stringify(req.query)}`;
      const cachedPosts = await redisClient.get(cacheKey);

      if (cachedPosts) {
        console.log(`[Cache Hit] 🚀 Loading all posts from Redis!`);
        return res.status(200).json({ result: JSON.parse(cachedPosts) });
      }

      console.log(`[Cache Miss] 🐢 Fetching all posts from Database...`);
      let queryList: Prisma.InputJsonValue[] = []

      queryList.push(
        {
            $sort: { createdAt: -1 }
        },
        {
          $lookup: {
            from: "User",
            localField: "userID",
            foreignField: "_id",
            as: "userPost"
          }
        },
        {
          $unwind: {
            path: "$userPost",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "Movie",
            localField: "movieID",
            foreignField: "_id",
            as: "movie"
          }
        },
        {
          $unwind: {
            path: "$movie",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "Comment",
            let: { postId: "$_id"},
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$postID", "$$postId"] }
                }
              },
              {
                $lookup: {
                  from: "User",
                  localField: "userID",
                  foreignField: "_id",
                  as: "userComment"
                }
              },
              {
                $unwind: {
                  path: "$userComment",
                  preserveNullAndEmptyArrays: true
                }
              }
            ],
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "Like",
            let: { postId: "$_id"},
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$postID", "$$postId"]}
                }
              },
              {
                $lookup: {
                  from: "User",
                  localField: "userID",
                  foreignField: "_id",
                  as: "userLike"
                }
              }
            ],
            as: "likes"
          }
        }
      )

      const result = await prisma.post.aggregateRaw({
        pipeline: [
          ...queryList,
          ...Filter.handleQueryAggregate(req.query)
        ]
      })
      
      UtilsHelpers.convertFieldList(result)

      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

      res.status(200).json({ result })
    } catch (error) {
      next(error)
    }
  },
  getByIdPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let queryList: Prisma.InputJsonValue[] = []
      const { id } = req.params

      const cacheKey = `posts:id:${id}`;
      const cachedPost = await redisClient.get(cacheKey);

      if (cachedPost) {
        console.log(`[Cache Hit] 🚀 Loading post ${id} from Redis!`);
        return res.status(200).json({ result: JSON.parse(cachedPost) });
      }

      console.log(`[Cache Miss] 🐢 Fetching post ${id} from Database...`);
      if (id) {
        queryList.push(
          {
            $match: {
              _id: { $oid: id }
            }
          }
        )
      }

      const result = await prisma.post.aggregateRaw({
        pipeline: [
          ...queryList,
           {
            $lookup: {
            from: "Movie",
            localField: "movieID",
            foreignField: "_id",
            as: "movie"
            }
          }
        ]
      })

      UtilsHelpers.convertFieldList(result)

      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

      res.status(200).json({ result })
    } catch (error) {
      next(error)
    }
  },
  deletedPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const result = await prisma.post.delete({
        where: {
          id: id
        }
      })

      await clearPostCache()
      res.status(200).json({ message: "Deleted successfully.", result })
    } catch (error) {
      next(error)
    }
  },
  getPostByUserId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let queryList: Prisma.InputJsonValue[] = []
      const { id } = req.params

      const cacheKey = `posts:userId:${id}:${JSON.stringify(req.query)}`;
      const cachedPosts = await redisClient.get(cacheKey);

      if (cachedPosts) {
        console.log(`[Cache Hit] 🚀 Loading user ${id} posts from Redis!`);
        return res.status(200).json({ result: JSON.parse(cachedPosts) });
      }

      console.log(`[Cache Miss] 🐢 Fetching user ${id} posts from Database...`);
      if (id) {
        queryList.push({
          $match: {
            userID: { $oid: id }
          }
        })
      }

      queryList.push(
        {
            $sort: { createdAt: -1 }
        },
        {
          $lookup: {
            from: "User",
            localField: "userID",
            foreignField: "_id",
            as: "userPost"
          }
        },
        {
          $unwind: {
            path: "$userPost",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "Movie",
            localField: "movieID",
            foreignField: "_id",
            as: "movie"
          }
        },
        {
          $unwind: {
            path: "$movie",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "Comment",
            let: { postId: "$_id"},
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$postID", "$$postId"] }
                }
              },
              {
                $lookup: {
                  from: "User",
                  localField: "userID",
                  foreignField: "_id",
                  as: "userComment"
                }
              },
              {
                $unwind: {
                  path: "$userComment",
                  preserveNullAndEmptyArrays: true
                }
              }
            ],
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "Like",
            let: { postId: "$_id"},
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$postID", "$$postId"]}
                }
              },
              {
                $lookup: {
                  from: "User",
                  localField: "userID",
                  foreignField: "_id",
                  as: "userLike"
                }
              }
            ],
            as: "likes"
          }
        }
      )

      const result = await prisma.post.aggregateRaw({
        pipeline: [
          ...queryList,
          ...Filter.handleQueryAggregate(req.query)
        ]
      })
      
      UtilsHelpers.convertFieldList(result)

      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

      res.status(200).json({ result })
    } catch (error) {
      next(error)
    }
  }
}