/**
 *
 * SideMenu
 *
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { FormattedMessage } from "react-intl";
import messages from "./messages";
import { CaretDown } from "styled-icons/boxicons-regular/CaretDown";

import Text from "../Text";
import FlexContainer from "../FlexContainer";
import Avatar from "../Avatar";
import Spacing from "../Spacing";
import SideMenuHeader from "./SideMenuHeader";

const SideMenuContainer = styled.div`
  position: relative;
  height: 100vh;
  padding: 0;
  margin: 0;
  left: 0;
  width: ${props => (props.open ? "300px" : "0px")};
  transition: width 2s;
  background: ${props => props.theme.secondary};
  box-shadow: 0px -6px 8px rgba(0, 0, 0, 0.16);
`;

const CaretDownContainer = styled.div`
  color: ${props => props.theme.primary40};
  width: 10%;
  text-align: left;
`;

const UserInfoContainer = styled.div`
  width: 80%;
`;

const UserInfoTextContainer = styled.div`
  margin-left: ${props => props.theme.spacing.eight};
`;

const CrossContainer = styled.div`
  color: ${props => props.theme.primary40};
  width: 10%;
  text-align: right;
`;

function getUserContextString({ orgName, teams, activeTeamIndex }) {
  const { teamName, unitName } = teams.filter(
    team => team.id === activeTeamIndex
  )[0];
  let displayString = "";
  if (teamName && unitName) {
    displayString = `${teamName} at ${orgName}, ${unitName}`;
  }
  return displayString;
}

function SideMenu(props) {
  const [open, setOpen] = useState(true);
  return (
    <SideMenuContainer open={open}>
      <SideMenuHeader>
        <FlexContainer mainAxis="space-between">
          <CaretDownContainer>
            <CaretDown />
          </CaretDownContainer>

          <UserInfoContainer>
            <FlexContainer mainAxis="flex-start">
              <Avatar name={props.user.name} />
              <UserInfoTextContainer>
                <Text type="caption" color="primary" case="title">
                  {props.user.name}
                </Text>
                <Spacing />
                <Text type="small" color="primary20" case="title">
                  {getUserContextString(props.user)}
                </Text>
              </UserInfoTextContainer>
            </FlexContainer>
          </UserInfoContainer>

          <CrossContainer>{open ? "x" : ""}</CrossContainer>
        </FlexContainer>
      </SideMenuHeader>
    </SideMenuContainer>
  );
}

SideMenu.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    orgName: PropTypes.string,
    activeTeamIndex: PropTypes.number,
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        teamName: PropTypes.string,
        unitName: PropTypes.string,
        role: PropTypes.string
      })
    )
  }).isRequired,
  actions: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onTeamChange: PropTypes.func.isRequired
};

export default SideMenu;
