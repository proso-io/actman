/*
 *
 * SearchActivities reducer
 *
 */
import produce from "immer";
import {
  DEFAULT_ACTION,
  SEARCH_REQUEST_ACTION,
  SEARCH_RESPONSE_ACTION,
  SEARCHING,
  NOT_SEARCHED,
  RESET_SEARCH_ACTION
} from "./constants";

export const initialState = { searchStatus: NOT_SEARCHED };

/* eslint-disable default-case, no-param-reassign */
const searchActivitiesReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SEARCH_REQUEST_ACTION:
        draft.searchStatus = SEARCHING;
        break;
      case SEARCH_RESPONSE_ACTION:
        draft.searchStatus = action.status;
        draft.searchResult = action.data;
        break;
      case RESET_SEARCH_ACTION:
        draft.searchStatus = NOT_SEARCHED;
        draft.searchResult = [];
        break;
    }
  });

export default searchActivitiesReducer;
