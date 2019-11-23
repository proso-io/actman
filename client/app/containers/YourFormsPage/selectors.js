import { createSelector } from "reselect";
import { initialState } from "./reducer";

/**
 * Direct selector to the yourFormsPage state domain
 */

const selectYourFormsPageDomain = state => state.yourFormsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by YourFormsPage
 */

const makeSelectForms = () =>
  createSelector(
    selectYourFormsPageDomain,
    substate => substate.forms
  );

const makeSelectFormsRequestState = () =>
  createSelector(
    selectYourFormsPageDomain,
    substate => substate.formsFetchState
  );

export { makeSelectForms, makeSelectFormsRequestState };
