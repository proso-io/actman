import { take, call, put, select, takeLatest } from "redux-saga/effects";
import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  CURRENT_USER_ENDPOINT,
  CURRENT_USER_REQUEST_FAILED,
  CURRENT_USER_REQUEST_IN_PROGRESS,
  CURRENT_USER_REQUEST_SUCCEEDED,
  FORMS_REQUEST_ACTION,
  GET_FORMS_REQUEST_SUCCEEDED,
  GET_FORMS_REQUEST_FAILED,
  GET_FORMS_ENDPOINT,
  UPLOAD_FORM_DATA_REQUEST_ACTION
} from "./constants";
import { userResponseAction, formsResponseAction } from "./actions";
import { makeSelectOrgId } from "./selectors";
import request from "utils/request";
import { formDataUploader } from "@proso-io/fobu/dist/uploadUtils";

// function userRequest() {
//   let userPromise = fetch(CURRENT_USER_ENDPOINT, {
//     method: "GET"
//   });
//   return userPromise;
// }

export function* getCurrentUser() {
  try {
    const response = yield call(request, CURRENT_USER_ENDPOINT);
    console.log("Get current user", response);
    if (response.username) {
      yield put(userResponseAction(CURRENT_USER_REQUEST_SUCCEEDED, response));
    } else {
      yield put(userResponseAction(CURRENT_USER_REQUEST_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(userResponseAction(CURRENT_USER_REQUEST_FAILED, null));
  }
}

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

function* sendUploadRequest({ type, requestData }) {
  formDataUploader(
    requestData.formData,
    requestData.formSchema,
    requestData.mergeObj,
    requestData.submitUrl,
    requestData.submitMethod,
    requestData.mediaUploadUrl,
    requestData.serviceWorkerUrl
  );
}

// Individual exports for testing
export default function* appSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(USER_REQUEST_ACTION, getCurrentUser);
  yield takeLatest(FORMS_REQUEST_ACTION, getForms);
  yield takeLatest(UPLOAD_FORM_DATA_REQUEST_ACTION, sendUploadRequest);
}
