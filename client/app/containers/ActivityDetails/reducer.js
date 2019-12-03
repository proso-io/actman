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
  GET_ACTIVITY_RESPONSE_ACTION,
  UPDATE_ACTIVITY_REQUEST_ACTION,
  UPDATE_ACTIVITY_RESPONSE_ACTION,
  UPDATING_ACTIVITY,
  UPDATE_ACTIVITY_SUCCEEDED,
  UPDATE_ADDON_REQUEST_ACTION,
  UPDATE_ADDON_RESPONSE_ACTION,
  UPDATE_ADDON_SUCCEEDED
} from "./constants";
import { LOCATION_CHANGE } from "connected-react-router";

export const initialState = {
  activityData: null
};

/* eslint-disable default-case, no-param-reassign */
const activityDetailsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOCATION_CHANGE:
        draft.getActivityState = null;
        draft.activityData = null;
        break;
      case DEFAULT_ACTION:
        break;
      case GET_ACTIVITY_REQUEST_ACTION:
        draft.getActivityState = GETTING_ACTIVITY;
        break;
      case GET_ACTIVITY_RESPONSE_ACTION:
        draft.activityData = action.data;
        draft.getActivityState = action.status;
      case UPDATE_ACTIVITY_REQUEST_ACTION:
        draft.updateActivityState = UPDATING_ACTIVITY;
        break;
      case UPDATE_ACTIVITY_RESPONSE_ACTION:
        draft.updateActivityState = action.status;
        if (action.status === UPDATE_ACTIVITY_SUCCEEDED) {
          draft.activityData = action.data;
        }
      case UPDATE_ADDON_REQUEST_ACTION:
        draft.updateAddonState = UPDATING_ACTIVITY;
        break;
      case UPDATE_ADDON_RESPONSE_ACTION:
        draft.updateAddonState = action.status;
        if (
          action.status === UPDATE_ADDON_SUCCEEDED &&
          action.entity === "Activities"
        ) {
          draft.activityData.mdata = action.data.mdata;
          draft.activityData.addonsmetadata = action.data.addonsmetadata;
        }
    }
  });

export default activityDetailsReducer;
