import { take, call, put, select, takeLatest } from "redux-saga/effects";
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
import { saveSchemaResponseAction } from "./actions";
import request from "utils/request";
import { makeSelectUserData } from "containers/App/selectors";

export function* saveSchema(action) {
  let schema = action.schema;
  console.log("saveSchema saga", schema);
  try {
    const userData = yield select(makeSelectUserData());
    let params = {
      oid: userData.oid,
      schema: schema,
      title: "Form Title"
    };
    const response = yield call(request, SCHEMA_UPLOAD_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    console.log("Save schema", response);
    if (response.performed) {
      yield put(saveSchemaResponseAction(SCHEMA_SAVE_SUCCEEDED, response.data));
    } else {
      yield put(saveSchemaResponseAction(SCHEMA_SAVE_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(saveSchemaResponseAction(SCHEMA_SAVE_FAILED, null));
  }
}

// Individual exports for testing
export default function* editSchemaPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(SCHEMA_SAVE_REQUEST_ACTION, saveSchema);
}
