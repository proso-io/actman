/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const USER_REQUEST_ACTION = "app/USER_REQUEST_ACTION";

export const USER_RESPONSE_ACTION = "app/USER_RESPONSE_ACTION";

export const RESET_FORMS_FETCH_STATE_ACTION =
  "app/app/RESET_FORMS_FETCH_STATE_ACTION";

export const CURRENT_USER_ENDPOINT = "/api/current-user";

export const CURRENT_USER_REQUEST_FAILED = -1;

export const CURRENT_USER_REQUEST_IN_PROGRESS = 0;

export const CURRENT_USER_REQUEST_SUCCEEDED = 1;

export const USER_NOT_FETCHED = 2;

export const FORMS_REQUEST_ACTION = "app/YourFormsPage/FORMS_REQUEST_ACTION";

export const FORMS_RESPONSE_ACTION = "app/YourFormsPage/FORMS_RESPONSE_ACTION";

export const GET_FORMS_ENDPOINT = "/api/schemas";

export const GET_FORMS_REQUEST_FAILED = -1;

export const GET_FORMS_REQUEST_IN_PROGRESS = 0;

export const GET_FORMS_REQUEST_SUCCEEDED = 1;

export const FORMS_NOT_FETCHED = 2;

export const UPLOAD_FORM_DATA_REQUEST_ACTION = "app/app/UPLOAD_FORM_DATA";
