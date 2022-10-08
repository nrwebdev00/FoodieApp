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


  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema);
export default User;