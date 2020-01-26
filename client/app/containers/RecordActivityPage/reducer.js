/*
 *
 * RecordActivity reducer
 *
 */
import produce from "immer";
import {
  PROGRAMS_REQUEST_ACTION,
  PROGRAMS_RESPONSE_ACTION,
  PROGRAMS_NOT_FETCHED,
  GET_PROGRAMS_REQUEST_IN_PROGRESS,
  ACTIVITY_REQUEST_ACTION,
  ACTIVITY_RESPONSE_ACTION,
  GET_ACTIVITY_REQUEST_FAILED,
  GET_ACTIVITY_REQUEST_SUCCEEDED,
  ACTIVITY_NOT_FETCHED,
  GET_ACTIVITY_REQUEST_IN_PROGRESS
} from "./constants";

export const initialState = {
  programs: [],
  programsFetchState: PROGRAMS_NOT_FETCHED,
  activityFetchState: ACTIVITY_NOT_FETCHED
};

/* eslint-disable default-case, no-param-reassign */
const recordActivityPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case PROGRAMS_REQUEST_ACTION:
        draft.programs = [];
        draft.programsFetchState = GET_PROGRAMS_REQUEST_IN_PROGRESS;
        break;
      case PROGRAMS_RESPONSE_ACTION:
        draft.programsFetchState = action.status;
        draft.programs = action.data;
        break;
      case ACTIVITY_REQUEST_ACTION:
        draft.activity = {};
        draft.activityFetchState = GET_ACTIVITY_REQUEST_IN_PROGRESS;
        break;
      case ACTIVITY_RESPONSE_ACTION:
        draft.activityFetchState = action.status;
        draft.activity = action.data;
        break;
    }
  });

export default recordActivityPageReducer;
