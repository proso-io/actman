/*
 * SideMenu Messages
 *
 * This contains all the text for the SideMenu component.
 */

import { defineMessages } from "react-intl";

export const scope = "app.components.SideMenu";

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: "This is the SideMenu component!"
  },
  actionsTitle: {
    id: `${scope}.actionsTitle`,
    defaultMessage: "Your actions"
  }
});
