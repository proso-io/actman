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
  background: ${props => props.theme[props.type]};
  color: ${props =>
    props.type === "primary" ? props.theme.secondary : props.theme.primary};
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
  animation: spin 2s linear infinite;
  width: 15px;

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
  const { text, type, state, onClick, loading, disabled } = props;
  return (
    <ButtonWrapper
      disabled={disabled}
      onClick={state == "enabled" && onClick}
      type={type}
    >
      {loading ? <Loader /> : text}
    </ButtonWrapper>
  );
}

Button.propTypes = {
  text: PropTypes.object,
  type: PropTypes.oneOf(["primary", "secondary", "link"]),
  state: PropTypes.oneOf(["loading", "disabled", "enabled"]),
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  type: "primary",
  state: "enabled",
  onClick: () => {},
  loading: false,
  disabled: false
};

export default Button;
