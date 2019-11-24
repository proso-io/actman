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
  CURRENT_USER_REQUEST_SUCCEEDED,
  FORMS_REQUEST_ACTION,
  FORMS_RESPONSE_ACTION,
  RESET_FORMS_FETCH_STATE_ACTION,
  UPLOAD_FORM_DATA_REQUEST_ACTION
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

export function formsRequestAction() {
  return {
    type: FORMS_REQUEST_ACTION
  };
}

export function formsResponseAction(status, data) {
  return {
    type: FORMS_RESPONSE_ACTION,
    data: data,
    status: status
  };
}

export function resetFormFetchStateAction() {
  return {
    type: RESET_FORMS_FETCH_STATE_ACTION
  };
}

export function uploadFormDataRequestAction(requestData) {
  return {
    type: UPLOAD_FORM_DATA_REQUEST_ACTION,
    requestData: requestData
  };
}
