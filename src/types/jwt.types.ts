import type { ObjectId } from "mongodb";

export type User = {
  userName: string,
  sub: ObjectId
};