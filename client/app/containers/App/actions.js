/*
 *
 * LoginPage actions
 *
 */

import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  CURRENT_USER_ENDPOINT,
  CURRENT_USER_REQUEST_FAILED,
  CURRENT_USER_REQUEST_IN_PROGRESS,
  CURRENT_USER_REQUEST_SUCCEEDED
} from "./constants";

export function userRequestAction() {
  return {
    type: USER_REQUEST_ACTION
  };
}

export function userResponseAction(status, data) {
  return {
    type: USER_RESPONSE_ACTION,
    data: data,
    status: status
  };
}
