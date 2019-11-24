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

const makeSelectOrgId = () =>
  createSelector(
    selectApp,
    appState => appState.userData.oid
  );

const makeSelectUserFetchingState = () =>
  createSelector(
    selectApp,
    appState => appState.currentUserFetchStatus
  );

const makeSelectForms = () =>
  createSelector(
    selectApp,
    substate => substate.forms
  );

const makeSelectFormsRequestState = () =>
  createSelector(
    selectApp,
    substate => substate.formsFetchState
  );

export {
  makeSelectLocation,
  makeSelectUserData,
  makeSelectUserFetchingState,
  makeSelectOrgId,
  makeSelectForms,
  makeSelectFormsRequestState
};
