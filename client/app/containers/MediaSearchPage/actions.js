/*
 *
 * MediaSearchPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SEARCH_REQUEST_ACTION,
  SEARCH_RESPONSE_ACTION
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}

export function searchRequestAcion(tags) {
  return {
    type: SEARCH_REQUEST_ACTION,
    tags: tags
  };
}

export function searchResponseAction(status, data) {
  return {
    type: SEARCH_RESPONSE_ACTION,
    status: status,
    data: data
  };
}
