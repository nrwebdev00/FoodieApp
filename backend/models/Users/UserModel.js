import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = mongoose.Schema(
  {
    userName:{
      type: String,
      required: [true, 'User Name is Required, Please Enter User Name.'],
      unique: true,
    },
    email:{
      type: String,
      required: [true, 'Email is Required, Please Enter Email.'],
      unique: true,
      match:[
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email not Valid, Please Enter Valid Email address'
      ]
    },
    password:{
      type: String,
      required: [true, 'Password is Required, Please Enter a Password'],
      select: false
    },
    role:{
      type: String,
      enum: ['user', 'staff', 'admin', 'moderator'],
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    ConfirmEmailToken: String,
    isEmailConfirmed:{
      type: Boolean,
      default: false,
    },
    mustChangePassword:{
      type: Boolean,
      default: false
    },
    createdAt:{
      type: Date,
      default: Date.now,
    }

  },
  {
    timestamps: true,
  }
)
// Compare Password
userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

// Hash Password
userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Generate token for forgot password
userSchema.methods.getForgotPasswordToken = function (){
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to ResetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

// Generate Confirm Email Token
userSchema.methods.generateEmailConfirmToken = function(next){
  const confirmationToken = crypto.randomBytes(20).toString('hex');

  this.ConfirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmationToken)
    .digest('hex');

    const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
    const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`
    return confirmTokenCombined;
}

const User = mongoose.model('User', userSchema);
export default User;