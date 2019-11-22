/**
 *
 * Text
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function getTextTransform(textCase) {
  let property = "inherit";
  switch (textCase) {
    case "title":
      property = "capitalize";
      break;
    case "uppercase":
      property = "uppercase";
      break;
    case "lowercase":
      property = "lowercase";
      break;
  }
  return property;
}

const Text = styled.div`
  font-size: ${props => props.theme.fontSizes[props.type]};
  color: ${props => props.theme[props.color]};
  font-weight: ${props => props.theme.fontWeights[props.weight || "normal"]};
  text-transform: ${props => getTextTransform(props.case)};
`;

Text.propTypes = {
  type: PropTypes.oneOf(["title", "subtitle", "caption", "body", "small"]),
  color: PropTypes.string,
  weight: PropTypes.string,
  case: PropTypes.oneOf(["title", "uppercase", "lowercase", "inherit"])
};

Text.defaultProps = {
  type: "body",
  color: "primary",
  weight: "normal",
  case: "inherit"
};

export default Text;
