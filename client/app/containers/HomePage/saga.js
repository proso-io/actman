import { take, call, put, select, takeLatest } from "redux-saga/effects";
import request from "utils/request";
import { searchResponseAction } from "./actions";

import {
  DEFAULT_ACTION,
  SEARCH_REQUEST_ACTION,
  SEARCHING,
  NOT_SEARCHED,
  SEARCH_SUCCEEDED,
  SEARCH_FAILED,
  SEARCH_ENDPOINT
} from "./constants";

function* search() {
  try {
    const response = yield call(request, `${SEARCH_ENDPOINT}`);
    console.log("Get activities", response);
    if (response.performed) {
      yield put(searchResponseAction(SEARCH_SUCCEEDED, response.data));
    } else {
      yield put(searchResponseAction(SEARCH_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(searchResponseAction(SEARCH_FAILED, null));
  }
}

// Individual exports for testing
export default function* homePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(SEARCH_REQUEST_ACTION, search);
}
