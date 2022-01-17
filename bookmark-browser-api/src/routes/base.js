import express from 'express';

const baseRouter = express.Router();

baseRouter.get('/', function(request, response, next) {
  response.send('Bookmark Browser API');
});

export default baseRouter;
