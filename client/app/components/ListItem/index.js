/**
 *
 * ListItem
 *
 */

import React from "react";
// import PropTypes from 'prop-types';
import styled from "styled-components";

const ListItem = styled.div`
  border: 1px solid ${props => props.theme.primary80};
  border-top: 0;
  padding: ${props => props.theme.spacing.twelve};
  background: ${props => props.theme.secondary};
  width: 80%;

  :nth-child(2) {
    margin-top: ${props => props.theme.spacing.eight};
    border-top: 1px solid ${props => props.theme.primary80};
  }
`;

export default ListItem;
