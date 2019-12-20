/**
 *
 * Link
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${props => props.theme[props.color]} !important;
  font-size: ${props => props.theme.fontSizes[props.fontSize]};
`;

function Link({ children, href, target, onClick, color, fontSize }) {
  return (
    <StyledLink
      href={href}
      target={target}
      onClick={onClick}
      color={color}
      fontSize={fontSize}
    >
      {children}
    </StyledLink>
  );
}

Link.propTypes = {
  href: PropTypes.string,
  target: PropTypes.oneOf(["_blank", "_self", "_parent", "_top"]),
  onClick: PropTypes.func,
  color: PropTypes.string,
  fontSize: PropTypes.string
};

Link.defaultProps = {
  href: "#",
  target: "_self",
  onClick: () => {},
  color: "primary",
  fontSize: "body"
};

export default Link;
