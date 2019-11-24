/*
 *
 * RecordActivity actions
 *
 */

import { PROGRAMS_REQUEST_ACTION, PROGRAMS_RESPONSE_ACTION } from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}

export function programsRequestAction() {
  return {
    type: PROGRAMS_REQUEST_ACTION
  };
}

export function programsResponseAction(status, data) {
  return {
    type: PROGRAMS_RESPONSE_ACTION,
    data: data,
    status: status
  };
}
