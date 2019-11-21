/**
 *
 * Button
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { FormattedMessage } from "react-intl";
import messages from "./messages";

const ButtonWrapper = styled.button`
  background: ${props => props.theme[props.type]};
  color: ${props =>
    props.type === "primary" ? props.theme.secondary : props.theme.primary};
  padding: ${props => props.theme.spacing.twelve}
    ${props => props.theme.spacing.twentyfour};
  border: none;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  font-weight: 600;
  cursor: pointer;

  :focus {
    outline: none;
  }
`;

function Button(props) {
  const { text, type, state, onClick } = props;
  return (
    <ButtonWrapper onClick={state == "enabled" && onClick} type={type}>
      {text}
    </ButtonWrapper>
  );
}

Button.propTypes = {
  text: PropTypes.object,
  type: PropTypes.oneOf(["primary", "secondary", "link"]),
  state: PropTypes.oneOf(["loading", "disabled", "enabled"]),
  onClick: PropTypes.func
};

Button.defaultProps = {
  type: "primary",
  state: "enabled",
  onClick: () => {}
};

export default Button;
