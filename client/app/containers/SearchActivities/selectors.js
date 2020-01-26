import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the searchActivities state domain
 */

const selectSearchActivitiesDomain = state =>
  state.searchActivities || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SearchActivities
 */

const makeSelectSearchActivities = () =>
  createSelector(
    selectSearchActivitiesDomain,
    substate => substate
  );

export default makeSelectSearchActivities;
export { selectSearchActivitiesDomain };
