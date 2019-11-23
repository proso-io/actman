/*
 *
 * LoginPage reducer
 *
 */
import produce from "immer";
import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  CURRENT_USER_ENDPOINT,
  CURRENT_USER_REQUEST_FAILED,
  CURRENT_USER_REQUEST_IN_PROGRESS,
  CURRENT_USER_REQUEST_SUCCEEDED
} from "./constants";

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const appPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case USER_REQUEST_ACTION:
        draft.userData = null;
        draft.currentUserFetchStatus = CURRENT_USER_REQUEST_IN_PROGRESS;
        break;
      case USER_RESPONSE_ACTION:
        console.log(USER_RESPONSE_ACTION, action);
        draft.currentUserFetchStatus = action.status;
        //draft.userData = action.data;
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
    }
  });

export default appPageReducer;
