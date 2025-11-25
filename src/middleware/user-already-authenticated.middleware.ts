import jwt from 'jsonwebtoken';
import type { Response, Request, NextFunction } from 'express';

const login = (req: Request, res: Response, next: NextFunction) => {
  const { userName, pw } = req.body;
  if (!userName) return res.status(400).json({ message: 'userName is not set' });
  if (!pw) return res.status(400).json({ message: 'password is not set' });
  next();
};

export function UserAlreadyAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token?.trim()) return login(req, res, next);
    const decoded = jwt.verify(token ?? '', process.env.JWT_ACCESS_TOKEN ?? '')
    if (decoded) return res.status(200).json({ message: 'User already authenticated' });
    login(req, res, next);
  } catch {
    login(req, res, next);
  }
}