import { configureStore } from '@reduxjs/toolkit'

import { userLoginReducer } from './Reducers/userReducer.js';

const store = configureStore({
  reducer:{
    userLogin: userLoginReducer
  },
})

export default store