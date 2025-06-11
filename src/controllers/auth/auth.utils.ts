import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export const JwtUtils = {
  signAccessToken: (payload: object) => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
      algorithm: "HS256",
      expiresIn: '5m'
    })
  },

  signRefreshToken: (payload: object) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      algorithm: "HS256", 
      expiresIn: '7d'
    })
  },

  verifyAccessToken: (token: string) => {
    return jwt.verify(token, JWT_ACCESS_SECRET, { algorithms: ["HS256"] })
  },

  verifyRefreshToken: (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET, { algorithms: ["HS256"] })
  },
}
