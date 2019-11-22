/**
 *
 * Avatar
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Circle = styled.div`
  border-radius: 20px;
  background: #ea4d4d;
  padding: 10px;
  width: 40px;
  height: 40px;
`;

const AvatarText = styled.p`
  color: white;
  font-weight: 600;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
`;

function getDisplayName(name) {
  let displayName;
  if (name.indexOf(" ") !== -1) {
    displayName = name
      .split(" ")
      .map(nameBlock => nameBlock[0])
      .join("");
  } else {
    displayName = `${name[0]}${name[1] ? name[1] : ""}`;
  }
  return displayName;
}

function Avatar({ name }) {
  return (
    <Circle>
      <AvatarText>{getDisplayName(name)}</AvatarText>
    </Circle>
  );
}

Avatar.propTypes = {
  name: PropTypes.string
};

export default Avatar;
