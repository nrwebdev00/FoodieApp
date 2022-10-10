import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv'

import User from './backend/models/Users/UserModel.js';
import Profile from './backend/models/Users/ProfileModel.js';

dotenv.config()

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const __dirname = path.resolve()

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)

const profiles = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/profiles.json`, 'utf-8')
)

const importData = async () =>{
  try {
    await User.create(users)
    await Profile.create(profiles)

    console.log('Data Imported...'.green.inverse)
    process.exit();
  } catch (error) {
    console.error(error)
  }
}

const deleteData = async () =>{
  try {
    await User.deleteMany();
    await Profile.deleteMany();

    console.log('Data Deleted...'.red.inverse)
    process.exit();
  } catch (error) {
    console.error(error)
  }
}

if(process.argv[2] === '-import'){
  importData();
} else if (process.argv[2] === '-delete'){
  deleteData();
}
