/*
 *
 * LoginPage reducer
 *
 */
import produce from "immer";
import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  CURRENT_USER_ENDPOINT
} from "./constants";

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const appPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case USER_REQUEST_ACTION:
        draft.userData = null;
        break;
      case USER_RESPONSE_ACTION:
        console.log(USER_RESPONSE_ACTION, action);
        draft.userData = action.data;
        if (action.data) {
          action.data.teams = action.data.teams.map(team => {
            return {
              teamId: team.t,
              teamUnitId: team.tu,
              role: team.rl,
              teamName: team.team,
              unitName: team.teamunit
            };
          });
        }
        draft.userData = action.data;
        break;
    }
  });

export default appPageReducer;
