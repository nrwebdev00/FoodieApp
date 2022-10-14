import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import morgan from 'morgan';
import cloudinary from 'cloudinary';

// Routes
  // User Routes
  import userRoutes from './routes/Users/userRoutes.js';
  import profileRoutes from './routes/Users/profileRoutes.js';
  // Uploads
  import uploadRoutes from './routes/Uploads/uploadRoutes.js';
  // Recipe Routes
  import recipeRoutes from './routes/Recipes/recipeRoutes.js';
  import recipeTagsRoutes from './routes/Recipes/recipeTagsRoutes.js';
  import recipeIngredientsRoutes from './routes/Recipes/recipeIngredientsRoutes.js';
  import recipeDirectionsRoutes from './routes/Recipes/recipeDirectionRoutes.js';
  import recipeImagesRoutes from './routes/Recipes/recipeImagesRoutes.js'

// Middleware, Utlis, and Configs
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

app.use(express.json());
app.use(cookieParser());

// TEST ROUTE
app.get('/', (req, res) =>{
  res.send(`API is running`)
})

// Routes
  // Users
  app.use('/api/users', userRoutes)
  app.use('/api/profile', profileRoutes)

  // Recipes
  app.use('/api/recipe', recipeRoutes)
  app.use('/api/recipeTags', recipeTagsRoutes)
  app.use('/api/recipeIngredients', recipeIngredientsRoutes)
  app.use('/api/recipeDirections', recipeDirectionsRoutes)
  app.use('/api/recipeImages', recipeImagesRoutes)

  // Articles

  // Uploads
  app.use('/api/uploads', uploadRoutes)

// Static
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Error Handling
app.use(errorResponse)

// Server Listen
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV}
mode, and on Port ${PORT}.`))