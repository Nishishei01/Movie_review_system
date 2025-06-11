import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database/src/cilent"
import { ValidateLogin, ValidateRegister } from "./auth.validator";
import bcrypt from 'bcrypt'
import { JwtUtils } from "../auth/auth.utils" 
import jwt, { JwtPayload } from "jsonwebtoken"

export default {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, firstName, lastName } = req.body as ValidateRegister

      const hashedPassword = await bcrypt.hash(password, 10)

      const createUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName
        }
      })

      res.status(201).json({ createUser })
    } catch (error) {
      next(error)
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {

    try {
      const { username, password } = req.body as ValidateLogin

      const checkUser = await prisma.user.findUnique({
        where: {
          username: username
        }
      })

      if (!checkUser) {
        res.status(401).json({ message: "Invalid username or password" });
        return
      }

      const checkPassword = await bcrypt.compare(password, checkUser.password)
      if (!checkPassword) {
        res.status(401).json({ message: 'Invalid username or password' })
        return
      }
      const payload = checkUser

      const accessToken = JwtUtils.signAccessToken(payload)
      const refreshToken = JwtUtils.signRefreshToken(payload)

      res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
      })

      res.status(201).json({ accessToken })

    } catch (error) {
      next(error)
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken

      if (!token) {
        res.status(401).json({ message: "Refresh Token missing or expired"})
      }

      const decoded = JwtUtils.verifyRefreshToken(token) as jwt.JwtPayload;
        
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id
        }
      })

      if (!user) {
       res.status(401).json({ message: "User not found" });
       return
    }

    const newAccessToken = JwtUtils.signAccessToken(user);

     res.status(200).json({ accessToken: newAccessToken });
     return

    } catch (error) {
      next(error)
    }
  }

}
