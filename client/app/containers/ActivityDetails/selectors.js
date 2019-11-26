import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the activityDetails state domain
 */

const selectActivityDetailsDomain = state =>
  state.activityDetails || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ActivityDetails
 */

const makeSelectActivityData = () =>
  createSelector(
    selectActivityDetailsDomain,
    substate => substate.activityData
  );

const makeSelectActivityDetailsState = () =>
  createSelector(
    selectActivityDetailsDomain,
    substate => substate.getActivityState
  );

export { makeSelectActivityData, makeSelectActivityDetailsState };
