import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Text from "components/Text";
import FlexContainer from "../../components/FlexContainer";
import Spacing from "../../components/Spacing";
import { ChevronRight } from "styled-icons/boxicons-regular/ChevronRight";

const StyledDetails = styled.details`
  margin-bottom: ${props => props.theme.spacing.sixteen};
`;

const StyledSummary = styled.summary`
  padding: ${props => props.theme.spacing.twentyfour};
  width: 90%;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  z-index: 100;
  :focus {
    outline: none;
  }
`;

const Well = styled(FlexContainer)`
  background: ${props => props.theme.secondary};
  width: 90%;
  padding: ${props => props.theme.spacing.sixteen};
  position: relative;
`;

const SummaryText = styled(Text)`
  display: inline;
  margin-left: ${props => props.theme.spacing.four};
`;

export default function CommentDetails(props) {
  return (
    <StyledDetails>
      <StyledSummary>
        <SummaryText type="caption">Activity comments</SummaryText>
      </StyledSummary>
      <Well mainAxis="flex-start" />
    </StyledDetails>
  );
}
