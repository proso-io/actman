/*
 *
 * LoginPage reducer
 *
 */
import produce from "immer";
import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  RESET_CURRENT_USER_STATE_ACTION,
  CURRENT_USER_REQUEST_IN_PROGRESS,
  CURRENT_USER_REQUEST_SUCCEEDED,
  FORMS_REQUEST_ACTION,
  FORMS_RESPONSE_ACTION,
  GET_FORMS_REQUEST_IN_PROGRESS,
  RESET_FORMS_FETCH_STATE_ACTION,
  FORMS_NOT_FETCHED,
  USER_NOT_FETCHED
} from "./constants";

export const initialState = {
  forms: [],
  currentUserFetchStatus: USER_NOT_FETCHED
};

/* eslint-disable default-case, no-param-reassign */
const appPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case USER_REQUEST_ACTION:
        draft.userData = null;
        draft.currentUserFetchStatus = CURRENT_USER_REQUEST_IN_PROGRESS;
        break;
      case USER_RESPONSE_ACTION:
        draft.currentUserFetchStatus = action.status;
        if (action.data) {
          action.data.teams = action.data.teams
            ? action.data.teams.map(team => {
                return {
                  teamId: team.t,
                  teamUnitId: team.tu,
                  role: team.rl,
                  teamName: team.team,
                  unitName: team.teamunit
                };
              })
            : [];
        }
        draft.userData = action.data;
        break;
      case RESET_CURRENT_USER_STATE_ACTION:
        draft.currentUserFetchStatus = USER_NOT_FETCHED;
        break;
      case FORMS_REQUEST_ACTION:
        draft.formsFetchState = GET_FORMS_REQUEST_IN_PROGRESS;
        draft.forms = [];
        break;
      case FORMS_RESPONSE_ACTION:
        draft.formsFetchState = action.status;
        draft.forms = action.data;
        break;
      case RESET_FORMS_FETCH_STATE_ACTION:
        draft.formsFetchState = FORMS_NOT_FETCHED;
    }
  });

export default appPageReducer;
