const routes = require('express').Router();
const namesControllers = require('../controllers/fonction');

routes.get('/', namesControllers.arthuRoute);
routes.get('/kevin', namesControllers.kevinRoute);
routes.get('/regis', namesControllers.registRoute);
routes.get('/fredi', namesControllers.frediRoute);
routes.get('/chico', namesControllers.tapeRoute);


module.exports = routes;