import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectRouter = state => state.router;
const selectApp = state => state.appPage || initialState;

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location
  );

const makeSelectUserData = () =>
  createSelector(
    selectApp,
    appState => appState.userData
  );

const makeSelectUserFetchingState = () =>
  createSelector(
    selectApp,
    appState => appState.fetchingCurrentUser
  );

export { makeSelectLocation, makeSelectUserData, makeSelectUserFetchingState };
