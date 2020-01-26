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

const makeSelectActivityId = () =>
  createSelector(
    selectActivityDetailsDomain,
    substate => substate.activityData._id
  );

const makeSelectActivityDetailsState = () =>
  createSelector(
    selectActivityDetailsDomain,
    substate => substate.getActivityState
  );

const makeSelectUpdateActivityDetailsState = () =>
  createSelector(
    selectActivityDetailsDomain,
    substate => substate.updateActivityState
  );

const makeSelectUpdateAddonState = () =>
  createSelector(
    selectActivityDetailsDomain,
    substate => substate.updateAddonState
  );

const makeSelectUpdateAddonType = () =>
  createSelector(
    selectActivityDetailsDomain,
    substate => substate.updateAddonType
  );

export {
  makeSelectActivityData,
  makeSelectActivityDetailsState,
  makeSelectUpdateActivityDetailsState,
  makeSelectActivityId,
  makeSelectUpdateAddonState,
  makeSelectUpdateAddonType
};
