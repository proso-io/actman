import { take, takeLatest, call, put, select } from "redux-saga/effects";
import {
  PROGRAMS_REQUEST_ACTION,
  GET_PROGRAMS_ENDPOINT,
  GET_PROGRAMS_REQUEST_FAILED,
  GET_PROGRAMS_REQUEST_SUCCEEDED,
  GET_ACTIVITY_ENDPOINT,
  ACTIVITY_REQUEST_ACTION,
  GET_ACTIVITY_REQUEST_FAILED,
  GET_ACTIVITY_REQUEST_SUCCEEDED
} from "./constants";
import { programsResponseAction, activityResponseAction } from "./actions";
import { makeSelectOrgId } from "containers/App/selectors";
import request from "utils/request";

function* getPrograms() {
  try {
    const orgId = yield select(makeSelectOrgId());

    const response = yield call(
      request,
      `${GET_PROGRAMS_ENDPOINT}?oid=${orgId}`
    );

    if (response) {
      yield put(
        programsResponseAction(GET_PROGRAMS_REQUEST_SUCCEEDED, response)
      );
    } else {
      yield put(programsResponseAction(GET_PROGRAMS_REQUEST_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(programsResponseAction(GET_PROGRAMS_REQUEST_FAILED, null));
  }
}

function* getActivity(action) {
  try {
    //const orgId = yield select(makeSelectOrgId());

    const response = yield call(
      request,
      `${GET_ACTIVITY_ENDPOINT}/${action.id}`
    );

    if (response) {
      yield put(
        activityResponseAction(GET_ACTIVITY_REQUEST_SUCCEEDED, response.data)
      );
    } else {
      yield put(activityResponseAction(GET_ACTIVITY_REQUEST_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(activityResponseAction(GET_ACTIVITY_REQUEST_FAILED, null));
  }
}

// Individual exports for testing
export default function* appSaga() {
  yield takeLatest(PROGRAMS_REQUEST_ACTION, getPrograms);
  yield takeLatest(ACTIVITY_REQUEST_ACTION, getActivity);
}
