/**
 *
 * Button
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { LoaderAlt } from "styled-icons/boxicons-regular/LoaderAlt";

import { FormattedMessage } from "react-intl";
import messages from "./messages";

const ButtonWrapper = styled.button`
  background: ${props => props.theme[props.themeType]};
  color: ${props =>
    props.themeType === "primary"
      ? props.theme.secondary
      : props.theme.primary};
  padding: ${props => props.theme.spacing.twelve}
    ${props => props.theme.spacing.sixteen};
  border: none;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.16);
  font-weight: 600;
  cursor: pointer;
  min-width: 120px;

  :focus {
    outline: none;
  }
`;

const Loader = styled(LoaderAlt)`
  animation: spin 1s linear infinite;
  width: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function Button(props) {
  const {
    type,
    themeType,
    state,
    onClick,
    loading,
    disabled,
    children
  } = props;
  return (
    <ButtonWrapper
      disabled={disabled}
      onClick={state == "enabled" && onClick}
      themeType={themeType}
      type={type}
    >
      {loading ? <Loader /> : children}
    </ButtonWrapper>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(["reset", "submit", "button"]),
  themeType: PropTypes.oneOf(["primary", "secondary", "link"]),
  state: PropTypes.oneOf(["loading", "disabled", "enabled"]),
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  type: "button",
  themeType: "primary",
  state: "enabled",
  onClick: () => {},
  loading: false,
  disabled: false
};

export default Button;
