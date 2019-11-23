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
  SCHEMA_UPLOAD_ENDPOINT,
  SCHEMA_SAVE_REQUEST_ACTION,
  SCHEMA_SAVE_RESPONSE_ACTION,
  SCHEMA_SAVE_SUCCEEDED,
  SCHEMA_SAVE_FAILED
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}

export function saveSchemaAction(schema) {
  console.log("in saveSchemaAction", schema);
  return {
    type: SCHEMA_SAVE_REQUEST_ACTION,
    schema: schema
  };
}

export function saveSchemaResponseAction(status, data) {
  console.log("insaveSchemaResponseAction", status, data);
  return {
    type: SCHEMA_SAVE_RESPONSE_ACTION,
    data: data,
    status: status
  };
}
