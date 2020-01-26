import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the editSchemaPage state domain
 */

const selectEditSchemaPageDomain = state =>
  state.editSchemaPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditSchemaPage
 */

const makeSelectEditSchemaPage = () =>
  createSelector(
    selectEditSchemaPageDomain,
    substate => substate
  );

export default makeSelectEditSchemaPage;
export { selectEditSchemaPageDomain };
