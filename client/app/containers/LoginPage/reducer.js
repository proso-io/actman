/*
 *
 * LoginPage reducer
 *
 */
import produce from "immer";
import { DEFAULT_ACTION, LOGIN_RESPONSE_ACTION, LOGIN_ENDPOINT, LOGIN_REQUEST_ACTION } from "./constants";

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const loginPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case LOGIN_REQUEST_ACTION:
      draft.loginStatus = 0;
      case LOGIN_RESPONSE_ACTION:
        console.log(LOGIN_RESPONSE_ACTION, action);
        draft.loginStatus = action.status;
        break;
    }
  });

export default loginPageReducer;
