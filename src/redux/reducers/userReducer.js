import * as actionTypes from "../types";

const initialState = {
  users: [],
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.GET_USERS:
      return {
        ...state,
        users: payload,
      };
    case actionTypes.ADD_USER:
      return {
        ...state,
        users: [payload, ...state.users],
      };
    case actionTypes.EDIT_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === payload.id
            ? {
                ...user,
                id: payload.id,
                name: payload.name,
                username: payload.username,
                email: payload.email,
                city: payload.city,
              }
            : user
        ),
      };
    case actionTypes.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== payload),
      };
    default:
      return state;
  }
};

export default userReducer;
