import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import type { Response, Request, NextFunction } from 'express';

dotenv.config();
export function AlreadyAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    const decoded = jwt.verify(token ?? '', process.env.JWT_ACCESS_TOKEN??'');
    if (decoded) return res.status(200).json({message: 'User already authenticated'});
  }
  const { userName, pw } = req.body;
  if (!userName) return res.status(400).json({ message: 'userName is not set'});
  if (!pw) return res.status(400).json({message:'password is not set'});
  next();
}