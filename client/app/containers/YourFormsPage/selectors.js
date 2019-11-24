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
