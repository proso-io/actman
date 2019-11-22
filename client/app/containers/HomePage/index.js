/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import messages from "./messages";

import SideMenu from "../../components/SideMenu";

export default function HomePage() {
  return (
    <>
      <SideMenu
        user={{
          name: "saumitra",
          orgName: "Goonj",
          activeTeamIndex: 0,
          teams: [{ id: 0, teamName: "Regional team", unitName: "Bihar" }]
        }}
      />
    </>
  );
}
