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
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  background: ${props => props.theme.white};
`;

const TextContainer = styled(FlexContainer)`
  height: 100%;
  padding-left: ${props => props.theme.spacing.fortytwo};
`;

function PageHeader({ title }) {
  return (
    <PageHeaderContainer>
      <TextContainer mainAxis="space-between" crossAxis="center">
        <Text type="title">{title}</Text>
      </TextContainer>
    </PageHeaderContainer>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string
};

export default PageHeader;
