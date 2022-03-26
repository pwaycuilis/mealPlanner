require('dotenv').config()
const express = require('express');
const path = require('path');

const app = express();

const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/foods')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))



const foodsRouter = require('./routes/api/foods');

// app.use('/api/foods', require('./routes/api/foods'));
app.use('/api/foods', foodsRouter);

module.exports = app;