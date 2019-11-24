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
  GET_PROGRAMS_REQUEST_IN_PROGRESS
} from "./constants";

export const initialState = {
  programs: [],
  programsFetchState: PROGRAMS_NOT_FETCHED
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
    }
  });

export default recordActivityPageReducer;
