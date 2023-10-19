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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"))
dbConnect()
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const authSwaggerDefinition = require('./swagger.json');
const prodSwaggerDefinition = require('./proSwagger.json');


const { notFound, errorHandler } = require('./src/middlewares/errorHandler');
const userRouter = require('./src/routes/authRoute');
const prodRouter = require('./src/routes/prodRoute');

// Serve Swagger UI at /docs
app.use('/api-authdocs', serve, setup(authSwaggerDefinition));
app.use('/api-prodocs', serve, setup(prodSwaggerDefinition));



app.use("/api/user", userRouter);
app.use('/api/product', prodRouter);
const port = 5000;

app.use(errorHandler)
app.use(notFound);
app.listen(process.env.PORT || port);
console.log(`Web Server is listening at: ${process.env.PORT || port}`);