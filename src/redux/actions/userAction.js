import api from "../../utils/api";
import * as actionTypes from "../types";

export const getUser = () => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.CREATE_USER_REQUEST });

    const res = await api("GET", "/");
    const json = await res.json();
    dispatch({
      type: actionTypes.GET_USERS,
      payload: json,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const addUser = (formData) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.CREATE_USER_REQUEST });

    const res = await api("POST", "/", formData);
    const json = await res.json();

    dispatch({
      type: actionTypes.ADD_USER,
      payload: json,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const editUser = (formData) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.CREATE_USER_REQUEST });

    const res = await api("PUT", `/${formData.id}`, formData);
    const json = await res.json();
    dispatch({
      type: actionTypes.EDIT_USER,
      payload: json,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.CREATE_USER_REQUEST });

    const res = await api("DELETE", `/${id}`);
    const json = await res.json();
    console.log(json);
    dispatch({
      type: actionTypes.DELETE_USER,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_ERRORS,
      payload: err.response.data,
    });
  }
};
