import express from 'express';
import env from 'dotenv';
import router from './router.js';

const app = express();

env.config();
app.use(router);
app.use(express.json());
app.listen(3000);