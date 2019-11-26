/*
 *
 * MediaSearchPage reducer
 *
 */
import produce from "immer";
import {
  DEFAULT_ACTION,
  SEARCH_REQUEST_ACTION,
  SEARCH_RESPONSE_ACTION,
  SEARCHING,
  NOT_SEARCHED
} from "./constants";

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const mediaSearchPageReducer = (state = initialState, action) =>
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
    }
  });

export default mediaSearchPageReducer;
