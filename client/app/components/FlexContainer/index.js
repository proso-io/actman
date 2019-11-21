/**
 *
 * FlexContainer
 *
 */

import React from "react";
// import PropTypes from "prop-types";
import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  height: ${props => props.height || "auto"};
  width: ${props => props.width || "auto"};
  flex-direction: ${props => props.direction || "row"};
  justify-content: ${props => props.mainAxis || "center"};
  align-items: ${props => props.crossAxis || "center"};
  flex-wrap: ${props => (props.wrap ? "wrap" : "nowrap")};
`;

export default FlexContainer;
