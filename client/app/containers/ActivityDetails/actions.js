/*
 *
 * ActivityDetails actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ACTIVITY_REQUEST_ACTION,
  GET_ACTIVITY_RESPONSE_ACTION
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}

export function getActivityAction(id) {
  return {
    type: GET_ACTIVITY_REQUEST_ACTION,
    id: id
  };
}

export function getActivityResponseAction(status, data) {
  return {
    type: GET_ACTIVITY_RESPONSE_ACTION,
    status: status,
    data: data
  };
}
