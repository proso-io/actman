/*
 *
 * EditSchemaPage reducer
 *
 */
import produce from "immer";
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
  GET_SCHEMA_FAILED,
  GETTING_SCHEMA
} from "./constants";

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const editSchemaPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    console.log("outer reducer");
    switch (action.type) {
      case SCHEMA_SAVE_REQUEST_ACTION:
        console.log("reducer", SCHEMA_SAVE_REQUEST_ACTION);
        draft.schemaSaveState = SCHEMA_SAVING_STATE;
        break;
      case SCHEMA_SAVE_RESPONSE_ACTION:
        console.log("reducer", SCHEMA_SAVE_RESPONSE_ACTION);
        draft.schemaSaveState = action.status;
        draft.schemaData = action.data;
        break;
      case GET_SCHEMA_REQUEST_ACTION:
        console.log("reducer", GET_SCHEMA_REQUEST_ACTION);
        draft.getSchemaState = GETTING_SCHEMA;
        break;
      case GET_SCHEMA_RESPONSE_ACTION:
        console.log("reducer", GET_SCHEMA_RESPONSE_ACTION);
        draft.schemaData = action.data;
        draft.getSchemaState = action.status;
    }
  });

export default editSchemaPageReducer;
