const express = require('express');
const cors = require('cors');
const { serve, setup } = require('swagger-ui-express');
const app = express();
const dotenv = require('dotenv').config();
const dbConnect = require('./src/configs/connectDB');
const bodyParser = require('body-parser');
// Use the JavaScript Swagger definition
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Middleware in order
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json()); // or app.use(express.urlencoded({ extended: true }));
dbConnect();

// Swagger Documentation Middleware
const swaggerDefinition = require('./swagger.json');
app.use('/api-docs', serve, setup(swaggerDefinition));

// API Routes Middleware
const { notFound, errorHandler } = require('./src/middlewares/errorHandler');
const userRouter = require('./src/routes/authRoute');
const prodRouter = require('./src/routes/prodRoute');
app.use("/api/user", userRouter);
app.use('/api/product', prodRouter);

// Error Handling Middleware
app.use(errorHandler);
app.use(notFound);

const port = 5000;
app.listen(process.env.PORT || port);
console.log(`Web Server is listening at: ${process.env.PORT || port}`);
