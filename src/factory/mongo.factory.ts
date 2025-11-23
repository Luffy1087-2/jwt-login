import dotenv from 'dotenv';
import { MongoConnectionString } from "../config/mongo.config.js";
import { MongoClient } from 'mongodb';

dotenv.config();
export class MongoFactory {
  private readonly client:MongoClient;
  
  constructor() {
    this.AssertEnvVars();
    this.client = new MongoClient(MongoConnectionString);
  }

  public async connect() {
    await this.client.connect();
  }

  public getCollection(collectionName: string) {
    const db = this.client.db();
    const collection = db.collection(collectionName);

    return collection;
  }

  private AssertEnvVars() {
    if (!process.env.JWT_ACCESS_TOKEN) throw new TypeError('JWT_ACCESS_TOKEN must be defined');
    if (!process.env.JWT_REFRESH_TOKEN) throw new TypeError('JWT_REFRESH_TOKEN must be defined');
  }
}