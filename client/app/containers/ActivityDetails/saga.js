import { take, takeLatest, call, put, select } from "redux-saga/effects";
import {
  ACTIVITIES_ENDPOINT,
  GET_ACTIVITY_SUCCEEDED,
  GET_ACTIVITY_FAILED,
  GET_ACTIVITY_REQUEST_ACTION,
  UPDATE_ACTIVITY_REQUEST_ACTION,
  UPDATING_ACTIVITY,
  UPDATE_ACTIVITY_SUCCEEDED,
  UPDATE_ACTIVITY_FAILED,
  UPDATE_ADDON_REQUEST_ACTION,
  UPDATE_ADDON_SUCCEEDED,
  UPDATE_ADDON_FAILED,
  ADDON_ENDPOINTS
} from "./constants";
import {
  getActivityResponseAction,
  updateActivityResponseAction,
  updateAddonResponseAction
} from "./actions";
import { makeSelectActivityId } from "./selectors";
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

function* updateActivity(action) {
  try {
    const activityId = yield select(makeSelectActivityId());
    let url = ACTIVITIES_ENDPOINT + "/" + activityId;
    const response = yield call(request, url, {
      method: "PUT",
      body: JSON.stringify(action.data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (response.performed) {
      yield put(
        updateActivityResponseAction(UPDATE_ACTIVITY_SUCCEEDED, response.data)
      );
    } else {
      yield put(updateActivityResponseAction(UPDATE_ACTIVITY_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(updateActivityResponseAction(UPDATE_ACTIVITY_FAILED, null));
  }
}

function* updateAddonData(action) {
  try {
    let url =
      ADDON_ENDPOINTS[action.data.addOnType] + "/" + action.data.entityId;
    const response = yield call(request, url, {
      method: "POST",
      body: JSON.stringify(action.data.addOnValue),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (response.performed) {
      yield put(
        updateAddonResponseAction(
          UPDATE_ADDON_SUCCEEDED,
          response.data,
          action.data.type
        )
      );
    } else {
      yield put(updateAddonResponseAction(UPDATE_ADDON_FAILED, null));
    }
  } catch (err) {
    console.log(err);
    yield put(updateAddonResponseAction(UPDATE_ADDON_FAILED, null));
  }
}

// Individual exports for testing
export default function* editSchemaPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ACTIVITY_REQUEST_ACTION, getActivity);
  yield takeLatest(UPDATE_ACTIVITY_REQUEST_ACTION, updateActivity);
  yield takeLatest(UPDATE_ADDON_REQUEST_ACTION, updateAddonData);
}
