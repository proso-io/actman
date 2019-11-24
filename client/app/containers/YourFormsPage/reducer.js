/*
 *
 * YourFormsPage reducer
 *
 */
import produce from "immer";
import {
  FORMS_REQUEST_ACTION,
  FORMS_RESPONSE_ACTION,
  FORMS_NOT_FETCHED,
  GET_FORMS_REQUEST_IN_PROGRESS
} from "./constants";

export const initialState = {
  forms: [],
  formsFetchState: FORMS_NOT_FETCHED
};

/* eslint-disable default-case, no-param-reassign */
const formsPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FORMS_REQUEST_ACTION:
        draft.forms = [];
        draft.formsFetchState = GET_FORMS_REQUEST_IN_PROGRESS;
        break;
      case FORMS_RESPONSE_ACTION:
        draft.formsFetchState = action.status;
        draft.forms = action.data;
        break;
    }
  });

export default formsPageReducer;
