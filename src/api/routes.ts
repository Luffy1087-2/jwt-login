import dotenv from 'dotenv';
import {Router} from 'express';
import { MongoFactory } from '../factory/mongo.factory.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoUsersCollection } from '../config/mongo.config.js';
import { AssertBodyParameters } from '../middleware/assert-params.middleware.js';
import { AlreadyAuthenticated } from '../middleware/already-authenticated.middleware.js';

dotenv.config();
const router = Router();
const db = new MongoFactory();

router.post('/login', AlreadyAuthenticated, async (req, res) => {
  const {userName, pw } = req.body;
  const users = db.getCollection(MongoUsersCollection);
  const user = await users.findOne({ userName });
  if (!user || !bcrypt.compareSync(pw, user.pw)) return res.status(403).json({message:'login failed'});
  const token = jwt.sign({userName}, process.env.JWT_ACCESS_TOKEN??'');
  res.status(201).json({token});
});

router.post('/register', AssertBodyParameters, async (req, res) => {
  try {
    const { userName, pw } = req.body;
    const users = db.getCollection(MongoUsersCollection);
    const user = await users.findOne({ userName });
    if (user) return res.status(403).json({message:'user already present'});
    const hashedPw = await bcrypt.hash(pw, 10);
    const dbDoc = await users.insertOne({userName, pw: hashedPw});
    if (!dbDoc.acknowledged) return res.status(403).json({message:'error while inserting document'});
    const token = jwt.sign({userName}, process.env.JWT_ACCESS_TOKEN ?? '', {expiresIn: '1h'});
    res.status(201).json({token});
  } catch (e: any) {
    res.status(500).json({message:e.message});
  }
});

router.get('/getTask', (req, res) => {

});

export default router;