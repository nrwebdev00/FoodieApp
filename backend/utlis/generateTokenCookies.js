import jwt from 'jsonwebtoken'

// Generates JSON Web Token
const generateToken = (id) =>{
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

// Generate Cookie With Res and Sends token
const sendCookieWithTokenRes = (user, statusCode, res) =>{
  const token = generateToken(user._id)

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ),
    httpOnly: true,
  }

  if(process.env.NODE_ENV === 'production'){
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      id: user._id,
      email: user.email,
      role: user.role,
      token
    })

}

export { generateToken, sendCookieWithTokenRes }