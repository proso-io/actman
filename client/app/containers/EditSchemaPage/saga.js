import { take, call, put, select, takeLatest } from "redux-saga/effects";
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
import { saveSchemaResponseAction, getSchemaResponseAction } from "./actions";
import request from "utils/request";
import { makeSelectUserData, makeSelectForms } from "containers/App/selectors";

import { resetFormFetchStateAction } from "containers/App/actions";

function* saveSchema(action) {
  let schema = action.schema;
  console.log("saveSchema saga", action);
  try {
    const userData = yield select(makeSelectUserData());
    let params = {
      schema: schema.schema,
      title: schema.title
    };
    let url = SCHEMA_ENDPOINT;
    let method = "POST";
    if (action.id && action.id !== "new") {
      url += "/" + action.id;
      method = "PUT";
    } else {
      params.oid = userData.oid;
    }
    const response = yield call(request, url, {
      method: method,
      body: JSON.stringify(params),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    console.log("Save schema", response);
    if (response.performed) {
      yield put(saveSchemaResponseAction(SCHEMA_SAVE_SUCCEEDED, response.data));
      yield put(resetFormFetchStateAction());
    } else {
      yield put(saveSchemaResponseAction(SCHEMA_SAVE_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(saveSchemaResponseAction(SCHEMA_SAVE_FAILED, null));
  }
}

function* getSchema(action) {
  console.log("getSchema saga", action);
  const schemaData = yield select(makeSelectForms());
  console.log("schema redux data", schemaData);
  try {
    //const userData = yield select(makeSelectUserData());
    let url = SCHEMA_ENDPOINT + "/" + action.id;
    const response = yield call(request, url);
    console.log("getSchema", response);
    if (response.performed) {
      yield put(getSchemaResponseAction(GET_SCHEMA_SUCCEEDED, response.data));
    } else {
      yield put(getSchemaResponseAction(GET_SCHEMA_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(getSchemaResponseAction(GET_SCHEMA_FAILED, null));
  }
}

// Individual exports for testing
export default function* editSchemaPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_SCHEMA_REQUEST_ACTION, getSchema);
  yield takeLatest(SCHEMA_SAVE_REQUEST_ACTION, saveSchema);
}
