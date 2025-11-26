import jwt from 'jsonwebtoken';
import db from "./mongo.service.js";
import { EnvVars } from '../core/env-vars.core.js';
import { MongoValidTokenCollection } from '../config/mongo.config.js';
import type { User } from '../types/jwt.types.js';

export async function invalidateRefreshToken(refreshToken: string) {
  if (!refreshToken && !refreshToken.trim().length) throw new TypeError('invalid refresh token');
  const user = jwt.verify(refreshToken, EnvVars.jwtRefreshToken) as unknown as User;
  if (!user) throw new TypeError('invalid refresh token');
  const validTokens = db.getCollection(MongoValidTokenCollection);
  const foundToken = await validTokens.findOne({ refreshToken });
  if (!foundToken) return;
  await validTokens.deleteOne({ _id: foundToken._id });
}

export async function addRefreshToken(refreshToken: string) {
  if (!refreshToken && !refreshToken.trim().length) throw new TypeError('invalid refresh token');
  const user = jwt.verify(refreshToken, EnvVars.jwtRefreshToken) as unknown as User;
  if (!user) throw new TypeError('invalid refresh token');
  const validTokens = db.getCollection(MongoValidTokenCollection);
  const foundToken = await validTokens.findOne({ sub: user.sub });
  if (!foundToken) await validTokens.insertOne({ sub: user.sub, refreshToken });
  else await validTokens.updateOne({ sub: user.sub }, { $set: { refreshToken } });
}

export async function isInWhiteList(refreshToken: string) {
  if (!refreshToken && !refreshToken.trim().length) throw new TypeError('invalid refresh token');
  const user = jwt.verify(refreshToken, EnvVars.jwtRefreshToken) as unknown as User;
  if (!user) throw new TypeError('invalid refresh token');
  const validTokens = db.getCollection(MongoValidTokenCollection);
  const foundToken = await validTokens.findOne({ refreshToken });

  return !!foundToken;
}