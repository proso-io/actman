/*
 *
 * RecordActivity actions
 *
 */

import {
  PROGRAMS_REQUEST_ACTION,
  PROGRAMS_RESPONSE_ACTION,
  ACTIVITY_REQUEST_ACTION,
  ACTIVITY_RESPONSE_ACTION
} from "./constants";

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

export function activityRequestAction(id) {
  return {
    type: ACTIVITY_REQUEST_ACTION,
    id: id
  };
}

export function activityResponseAction(status, data) {
  return {
    type: ACTIVITY_RESPONSE_ACTION,
    data: data,
    status: status
  };
}
