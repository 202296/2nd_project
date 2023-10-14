const path = require('../routes/authRoute');
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = path // Update the path accordingly

const doc = {
  info: {
    title: 'User API',
    description: 'API for managing user data',
  },
  host: 'localhost:5000', // Update with your API's host
  basePath: '/',
  schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js'); // Update with your main Express app file
});
