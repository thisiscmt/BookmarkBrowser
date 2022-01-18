import express from 'express';
import cors from 'cors';

import baseRouter from './routes/base.js';
import bookmarkRouter from './routes/bookmark.js';

const app = express();

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(cors({
    origin: process.env.BMB_ALLOWED_ORIGIN
}));

app.use('/', baseRouter);
app.use('/bookmark', bookmarkRouter);

export default app;
