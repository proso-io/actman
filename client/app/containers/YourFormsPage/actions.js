/*
 *
 * YourFormsPage actions
 *
 */

import { FORMS_REQUEST_ACTION, FORMS_RESPONSE_ACTION } from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
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
