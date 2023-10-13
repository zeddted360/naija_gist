import { createContext, useReducer } from 'react';

export const DispatchContext = createContext();

export const dispatchContextReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ALL_BLOGS':
      return {
        data: action.payload
      };
    case 'CREATE_BLOG':
      return {
        data: [ action.payload, ...state.data]
      };
    case 'DELETE_BLOG':
      return {
        data: state.data.filter((item) => item._id !== action.payload._id)
      };
      case "UPDATE_BLOG" :
        return {
          data: state.data.map((item) => item._id === action.payload._id ? action.payload : item
          ),
        };
    default:
      return state;
  }
};

export const DispatchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dispatchContextReducer, {
    data:[],
  });
  return (
    <DispatchContext.Provider value={{ ...state, dispatch }}>
      { children }
    </DispatchContext.Provider>
  );
};
