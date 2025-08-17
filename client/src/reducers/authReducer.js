import { SET_CURRENT_USER, USER_LOADING } from '../actions/types';

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

const authReducer = (state = initialState, action) => {
  console.log('🔐 Auth reducer - action:', action.type, 'payload:', action.payload);
  
  switch (action.type) {
    case SET_CURRENT_USER:
      const newState = {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
      console.log('🔐 Auth reducer - new state:', newState);
      return newState;
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case 'FORCE_UPDATE':
      // Force a re-render by returning a new state object
      return {
        ...state
      };
    default:
      return state;
  }
};

export default authReducer;
