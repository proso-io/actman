import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the recordActivity state domain
 */

const selectRecordActivityDomain = state =>
  state.recordActivity || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecordActivity
 */

const makeSelectPrograms = () =>
  createSelector(
    selectRecordActivityDomain,
    substate => substate.programs
  );

const makeSelectProgramsRequestState = () =>
  createSelector(
    selectRecordActivityDomain,
    substate => substate.programsFetchState
  );

const makeSelectActivity = () =>
  createSelector(
    selectRecordActivityDomain,
    substate => substate.activity
  );

const makeSelectActivityRequestState = () =>
  createSelector(
    selectRecordActivityDomain,
    substate => substate.activityFetchState
  );

export {
  makeSelectPrograms,
  makeSelectProgramsRequestState,
  makeSelectActivity,
  makeSelectActivityRequestState
};
