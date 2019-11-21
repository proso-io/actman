/*
 *
 * LoginPage reducer
 *
 */
import produce from "immer";
import { DEFAULT_ACTION, LOGIN_RESPONSE_ACTION, LOGIN_ENDPOINT } from "./constants";

export const initialState = {};

// function login = (username, password) => {
//   let formData = new FormData();
//   formData.append('username', username);
//   formData.append('password', password);
//   let loginPromise = fetch(LOGIN_ENDPOINT, {
//     method: "POST",
//     body: formData
//   })
// }

/* eslint-disable default-case, no-param-reassign */
const loginPageReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;

    }
  });

export default loginPageReducer;
