const express = require('express');
const cors = require('cors');
const { serve, setup } = require('swagger-ui-express');
const app = express();
app.use(cors());
const bodyParser = require('body-parser')
// Use the JavaScript Swagger definition
const swaggerDefinition = require('./swagger.json');
const dbConnect = require('./src/configs/connectDB');
const dotenv = require('dotenv').config();
const userRouter = require('./src/routes/authRoute');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Serve Swagger UI at /docs
app.use('/api-docs', serve, setup(swaggerDefinition));


dbConnect()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/user", userRouter);
const port = 5000;
app.listen(process.env.PORT || port);
console.log(`Web Server is listening at: ${process.env.PORT || port}`);