import { take, takeLatest, call, put, select } from "redux-saga/effects";
import {
  FORMS_REQUEST_ACTION,
  GET_FORMS_ENDPOINT,
  GET_FORMS_REQUEST_FAILED,
  GET_FORMS_REQUEST_SUCCEEDED
} from "./constants";
import { formsResponseAction } from "./actions";
import { makeSelectOrgId } from "containers/App/selectors";
import request from "utils/request";

function* getForms() {
  try {
    const orgId = yield select(makeSelectOrgId());
    console.log(orgId);
    const response = yield call(request, `${GET_FORMS_ENDPOINT}?oid=${orgId}`);
    console.log("Get forms", response);
    if (response.performed) {
      yield put(
        formsResponseAction(GET_FORMS_REQUEST_SUCCEEDED, response.data)
      );
    } else {
      yield put(formsResponseAction(GET_FORMS_REQUEST_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(formsResponseAction(GET_FORMS_REQUEST_FAILED, null));
  }
}

// Individual exports for testing
export default function* appSaga() {
  yield takeLatest(FORMS_REQUEST_ACTION, getForms);
}
