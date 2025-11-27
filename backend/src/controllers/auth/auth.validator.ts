import z from "zod";
import { prisma } from "../../database/src/cilent"
import { Request, Response, NextFunction } from "express"
import { JwtUtils } from "./auth.utils";

const ValidateAuth = {
  jwtProtect: (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 
  
  if (!token) {
     res.status(401).json({ message: "Access token is missing" });
     return
  }

  try {
    const decoded = JwtUtils.verifyAccessToken(token);
    res.locals.user = decoded;
    next();
  } catch (err) {
     res.status(403).json({ message: "Invalid or expired token" });
     return
  }
 },
  validateRegister: z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
  }).superRefine(async (val, ctx) => {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: val.username,
        email: val.email,
      }
    })

    if (existingUser) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username or Email already exist.'
      })
    }
  }),
  validateLogin: z.object({
    username: z.string(),
    password: z.string(),
  })
}

export type ValidateRegister = z.infer <typeof ValidateAuth["validateRegister"]>
export type ValidateLogin = z.infer <typeof ValidateAuth["validateLogin"]>
export default ValidateAuth
