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

export const CURRENT_USER_ENDPOINT = "/api/current-user";

export const CURRENT_USER_REQUEST_FAILED = -1;

export const CURRENT_USER_REQUEST_IN_PROGRESS = 0;

export const CURRENT_USER_REQUEST_SUCCEEDED = 1;

export const USER_NOT_FETCHED = 2;
