/*
 *
 * ActivityDetails reducer
 *
 */
import produce from "immer";
import {
  DEFAULT_ACTION,
  GET_ACTIVITY_REQUEST_ACTION,
  GETTING_ACTIVITY,
  GET_ACTIVITY_RESPONSE_ACTION
} from "./constants";

export const initialState = {
  activityData: null
};

/* eslint-disable default-case, no-param-reassign */
const activityDetailsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_ACTIVITY_REQUEST_ACTION:
        draft.getActivityState = GETTING_ACTIVITY;
        break;
      case GET_ACTIVITY_RESPONSE_ACTION:
        draft.activityData = action.data;
        draft.getActivityState = action.status;
    }
  });

export default activityDetailsReducer;
