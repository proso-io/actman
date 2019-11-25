import { take, takeLatest, call, put, select } from "redux-saga/effects";
import {
  ACTIVITIES_ENDPOINT,
  GET_ACTIVITY_SUCCEEDED,
  GET_ACTIVITY_FAILED,
  GET_ACTIVITY_REQUEST_ACTION
} from "./constants";
import { getActivityResponseAction } from "./actions";
import request from "utils/request";

function* getActivity({ id }) {
  try {
    let url = ACTIVITIES_ENDPOINT + "/" + id;
    const response = yield call(request, url);
    if (response.performed) {
      yield put(
        getActivityResponseAction(GET_ACTIVITY_SUCCEEDED, response.data)
      );
    } else {
      yield put(getActivityResponseAction(GET_ACTIVITY_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(getActivityResponseAction(GET_ACTIVITY_FAILED, null));
  }
}

// Individual exports for testing
export default function* editSchemaPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ACTIVITY_REQUEST_ACTION, getActivity);
}
