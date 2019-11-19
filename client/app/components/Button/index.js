/**
 *
 * Button
 *
 */

import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FormattedMessage } from "react-intl";
import messages from "./messages";

const ButtonWrapper = styled.button`
  background: ${props => props.theme[props.type]};
  color: ${props => props.type === 'primary' ? props.theme.secondary : props.theme.primary};
  padding: 10px 20px;
`;

function Button(props) {
  const { text, type, state, onClick } = props;
  return (
    <ButtonWrapper onClick={state == 'enabled' && onClick} type={type}>
      {text}
    </ButtonWrapper>
  );
}

Button.propTypes = {
  text: PropTypes.object,
  type: PropTypes.oneOf(['primary', 'secondary', 'link']),
  state: PropTypes.oneOf(['loading', 'disabled', 'enabled']),
  onClick: PropTypes.func
};

Button.defaultProps = {
  type: 'primary',
  state: 'enabled',
  onClick: ()=>{}
}

export default Button;
