import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the mediaSearchPage state domain
 */

const selectMediaSearchPageDomain = state =>
  state.mediaSearchPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MediaSearchPage
 */

const makeSelectMediaSearchPage = () =>
  createSelector(
    selectMediaSearchPageDomain,
    substate => substate
  );

export default makeSelectMediaSearchPage;
export { selectMediaSearchPageDomain };
