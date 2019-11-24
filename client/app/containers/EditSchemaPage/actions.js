/*
 *
 * EditSchemaPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SCHEMA_SAVED_STATE,
  SCHEMA_UNSAVED_STATE,
  SCHEMA_SAVING_STATE,
  SCHEMA_ENDPOINT,
  SCHEMA_SAVE_REQUEST_ACTION,
  SCHEMA_SAVE_RESPONSE_ACTION,
  SCHEMA_SAVE_SUCCEEDED,
  SCHEMA_SAVE_FAILED,
  GET_SCHEMA_REQUEST_ACTION,
  GET_SCHEMA_RESPONSE_ACTION,
  GET_SCHEMA_SUCCEEDED,
  GET_SCHEMA_FAILED
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}

export function saveSchemaAction(schema, id) {
  console.log("in saveSchemaAction", schema, id);
  return {
    type: SCHEMA_SAVE_REQUEST_ACTION,
    schema: schema,
    id: id
  };
}

export function saveSchemaResponseAction(status, data) {
  console.log("in saveSchemaResponseAction", status, data);
  return {
    type: SCHEMA_SAVE_RESPONSE_ACTION,
    data: data,
    status: status
  };
}

export function getSchemaAction(id) {
  console.log("in getSchemaAction", id);
  return {
    type: GET_SCHEMA_REQUEST_ACTION,
    id: id
  };
}

export function getSchemaResponseAction(status, data) {
  console.log("in getSchemaResponse", status, data);
  return {
    type: GET_SCHEMA_RESPONSE_ACTION,
    status: status,
    data: data
  };
}
