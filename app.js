// NAMESPACES
require("dotenv").config();     
const express = require('express');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes  = require('./routes/admin/userRoute');

// VARIABLES

const port = process.env.PORT || 8080;
const sequelize = new Sequelize(process.env.CONNECTION_STRING);

// INIT

const app = express();

// CONNECT TO DATABASE

sequelize.authenticate().then(() => {
    console.log('DB Connected successfully !!!');
}).catch((err) => {
    console.log(err);
});

// MIDDLEWARES

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// ROUTES

app.use('/api', userRoutes);

// METHODS

app.listen(port, () => {
    console.log(`your app started successfully and is running at port: ${port}`);
});


