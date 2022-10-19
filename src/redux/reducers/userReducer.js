import * as actionTypes from "../types";

const initialState = {
  users: [],
  loading: true,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.CREATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
      };
    case actionTypes.ADD_USER:
      return {
        ...state,
        users: [payload, ...state.users],
        loading: false,
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
        loading: false,
      };
    case actionTypes.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== payload),
        loading: false,
      };
    default:
      return state;
  }
};

export default userReducer;
