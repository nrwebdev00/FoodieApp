import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import cloudinary from 'cloudinary';

import errorResponse from './middleware/error.js';
import connectDB from './config/db.js';

// Config Server
dotenv.config()

connectDB()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express()

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

app.use(express.json())

// TEST ROUTE
app.get('/', (req, res) =>{
  res.send(`API is running`)
})

// Routes


// Static
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Error Handling
app.use(errorResponse)

// Server Listen
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV}
mode, and on Port ${PORT}.`))