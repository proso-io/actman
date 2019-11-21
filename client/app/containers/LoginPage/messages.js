/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage container.
 */

import { defineMessages } from "react-intl";

export const scope = "app.containers.LoginPage";

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: "This is the LoginPage container!"
  },
  login: {
    id: `${scope}.login`,
    defaultMessage: "Login"
  },
  submit: {
    id: `${scope}.submit`,
    defaultMessage: "Submit"
  },
  username: {
    id: `${scope}.username`,
    defaultMessage: "Username"
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: "Password"
  }
});
