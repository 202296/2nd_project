const express = require('express');
const dbConnect = require('./src/configs/connectDB');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const authRouter = require('./src/routes/authRoute');



const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
dbConnect()

app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())


app.use('/api/user', authRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`);
})
