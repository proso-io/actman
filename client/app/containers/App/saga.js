import { take, call, put, select, takeLatest } from "redux-saga/effects";
import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  CURRENT_USER_ENDPOINT
} from "./constants";
import { userResponseAction } from "./actions";
import request from "utils/request";

// function userRequest() {
//   let userPromise = fetch(CURRENT_USER_ENDPOINT, {
//     method: "GET"
//   });
//   return userPromise;
// }

export function* getCurrentUser() {
  console.log();
  try {
    const response = yield call(request, CURRENT_USER_ENDPOINT);
    console.log("Get current user", response);
    yield put(userResponseAction(response));
  } catch (err) {
    console.log(err);
    yield put(userResponseAction(null));
  }
}

// Individual exports for testing
export default function* appSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(USER_REQUEST_ACTION, getCurrentUser);
}
