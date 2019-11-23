/*
 *
 * LoginPage actions
 *
 */

import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  CURRENT_USER_ENDPOINT
} from "./constants";

export function userRequestAction() {
  return {
    type: USER_REQUEST_ACTION
  };
}

export function userResponseAction(data) {
  return {
    type: USER_RESPONSE_ACTION,
    data: data
  };
}
