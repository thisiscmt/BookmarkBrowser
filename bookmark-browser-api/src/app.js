import express from 'express';
import cors from 'cors';

import baseRouter from './routes/base.js';
import bookmarkRouter from './routes/bookmark.js';

const app = express();

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(cors({
    origin: 'http://localhost:3006'
}));

app.use('/api', baseRouter);
app.use('/api/bookmark', bookmarkRouter);

export default app;
