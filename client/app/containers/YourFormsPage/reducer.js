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
  formsFetchState: FORMS_NOT_FETCHED
};

/* eslint-disable default-case, no-param-reassign */
const formsPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
    }
  });

export default formsPageReducer;
