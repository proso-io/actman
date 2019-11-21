/*
 *
 * LoginPage actions
 *
 */

import { DEFAULT_ACTION, LOGIN_REQUEST_ACTION, LOGIN_RESPONSE_ACTION } from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}

export function loginRequestAction(username, password) {
  return {
    type: LOGIN_REQUEST_ACTION,
    username: username,
    password: password
  }
}

export function loginResponseAction() {
  return {
    type: LOGIN_RESPONSE_ACTION
  }
}
