/**
 *
 * Spacing
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Spacing = styled.div`
  width: ${props =>
    props.type === "horizontal" ? props.theme.spacing[props.spacing] : "100%"};
  height: ${props =>
    props.type === "vertical" ? props.theme.spacing[props.spacing] : "100%"};
`;

Spacing.propTypes = {
  type: PropTypes.oneOf(["horizontal", "vertical"]),
  spacing: PropTypes.string
};

Spacing.defaultProps = {
  type: "vertical",
  spacing: "four"
};

export default Spacing;
