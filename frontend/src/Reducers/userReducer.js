import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_REQUEST,
  USER_PROFILE_INFO_REQUEST,
  USER_PROFILE_INFO_SUCCESS,
  USER_PROFILE_INFO_FAIL,
  USER_PROFILE_INFO_RESET,
  USER_PROFILE_UPDATE_FAIL,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_IMAGE_EDITED_FAIL,
  USER_PROFILE_IMAGE_EDITED_REQUEST,
  USER_PROFILE_IMAGE_EDITED_SUCCESS,
  USER_PROFILE_IMAGE_EDITED_RESET,
  USER_PROFILE_IMAGE_UPLOAD_FAIL,
  USER_PROFILE_IMAGE_UPLOAD_SUCCESS,
  USER_PROFILE_IMAGE_UPLOAD_REQUEST,
} from '../Constants/userConstants.js';


export const userLoginReducer = (state = {}, action) =>{
  switch(action.type){
    case USER_LOGIN_REQUEST:
      return { loading: true }
    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload
      }
    case USER_LOGIN_FAIL:
      return{
        loading: false,
        error: action.payload
      }
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const userRegisterReducer = (state = {}, action) =>{
  switch(action.type){
    case USER_REGISTER_REQUEST:
      return { loading: true}
    case USER_REGISTER_SUCCESS:
      return{
        loading: false,
        userInfo: action.payload
      }
    case USER_REGISTER_FAIL:
      return{
        loading: false,
        error: action.payload
      }
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const userProfileInfoReducer = (state = {profile:{} }, action) =>{
  switch(action.type){
    case USER_PROFILE_INFO_REQUEST:
      return{...state, loading: true}
    case USER_PROFILE_INFO_SUCCESS:
      return{
        loading: false,
        profile: action.payload,
      }
    case USER_PROFILE_INFO_FAIL:
      return{
        loading: false,
        error: action.payload
      }
    case USER_PROFILE_INFO_RESET:
      return{ user:{} }
    default:
      return state
  }
}

export const userProfileUpdateReducer = (state = {}, action) => {
  switch(action.type){
    case USER_PROFILE_UPDATE_REQUEST:
      return{
        lading: true
      }
    case USER_PROFILE_UPDATE_SUCCESS:
      return{
        lading: false,
        success: true,
        profileUpdated: action.payload
      }
    case USER_PROFILE_UPDATE_FAIL:
      return{
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}

export const userProfileImageEditedReducer = (state = {editedImage:{} }, action) =>{
  switch(action.type){
    case USER_PROFILE_IMAGE_EDITED_REQUEST:
      return{
        loading: true,
      }
    case USER_PROFILE_IMAGE_EDITED_SUCCESS:
      return{
        loading: false,
        editedImage: action.payload
      }
    case USER_PROFILE_IMAGE_EDITED_FAIL:
      return{
        loading: false,
        error: action.payload
      }
    case USER_PROFILE_IMAGE_EDITED_RESET:
      return{ editedImage:{} }
    default:
      return state
  }
}

export const userProfileImageUploadReducer = (state = {}, action) => {
  switch(action.type){
    case USER_PROFILE_IMAGE_UPLOAD_REQUEST:
      return{
        loading: true,
      }
    case USER_PROFILE_IMAGE_UPLOAD_SUCCESS:
      return{
        loading: false,
        success: true,
        profileUpdated: action.payload
      }
    case USER_PROFILE_IMAGE_UPLOAD_FAIL:
      return{
        loading: false,
        success: false,
        error: action.payload
      }
    default:
      return state
  }
}