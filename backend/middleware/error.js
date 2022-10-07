import ErrorHandler from "../utlis/errorHandler.js";

const errorResponse = (err, req, res, next) =>{
  let error = {...err};

  error.message = err.message;

  // Mongoose ObjectId Error
  if(err.name === 'CastError'){
    const message = 'Item not Found.'
    error = new ErrorHandler(message, 404);
  }

  // Mongoose Duplicate Key Error
  if(err.code === 11000){
    const message = 'Item already exists.'
    error = new ErrorHandler(message, 400)
  }

  // Mongoose Validation Error
  if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorHandler(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

export default errorResponse;