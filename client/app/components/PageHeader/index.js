/**
 *
 * PageHeader
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Text from "../Text";
import FlexContainer from "../FlexContainer";

const PageHeaderContainer = styled.div`
  height: 80px;
  width: 100%;
  padding: ${props => props.theme.spacing.twentyfour};
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  background: ${props => props.theme.white};
`;

function PageHeader({ title }) {
  return (
    <PageHeaderContainer>
      <FlexContainer mainAxis="space-between">
        <Text type="title">{title}</Text>
      </FlexContainer>
    </PageHeaderContainer>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string
};

export default PageHeader;
