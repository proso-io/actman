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

const Column = styled.div`
  min-height: 300px;
  max-height: 300px;
  overflow-y: auto;
  min-width: 25%;
  margin-right: ${props => props.theme.spacing.sixteen};
  background: ${props => props.theme.white};

  :last-child {
    flex-grow: 1;
  }
`;

const FormElementColumn = styled.div`
  width: 50%;
`;

const Row = styled(FlexContainer)`
  padding: ${props => props.theme.spacing.twelve};
  text-align: left;
  border-bottom: 1px solid ${props => props.theme.primary60};
`;

const StyledChevron = styled(ChevronRight)`
  width: 20px;
  color: ${props => props.theme.primary20};
`;

export default function TextDetails({ schema, mdata }) {
  const [activeChain, setActiveChain] = useState("");

  function getMarkupForLevel(blocks, formData, parentBlockId) {
    return blocks.map(block => {
      if (block.type === "section" || block.type === "group") {
        const { title } = block.elementParams;
        return (
          <Row
            key={block.id}
            mainAxis="space-between"
            width="100%"
            onClick={() => setActiveChain(`${parentBlockId}-->${block.id}-->`)}
          >
            <Text type="body" weight="semibold" color="primary40">
              {title}
            </Text>
            <StyledChevron />
          </Row>
        );
      } else if (block.type !== "imagesWithTags") {
        const { label, name } = block.elementParams;
        return (
          <Row key={block.id} mainAxis="space-between" width="100%">
            <FormElementColumn>
              <Text type="body" weight="semibold" color="primary40">
                {label} {name ? `(${name})` : ""}
              </Text>
            </FormElementColumn>
            <Spacing spacing="twelve" direction="horizontal" />
            <FormElementColumn>
              <Text type="body" color="primary">
                {String(formData[block.id])}
              </Text>
            </FormElementColumn>
          </Row>
        );
      } else {
        return <span />;
      }
    });
  }

  function getMarkupTillActiveChain(schema, formData, activeChain) {
    let i = 0,
      markup,
      localSchema = Object.assign({}, schema),
      parentId;

    const activeChainArray = activeChain.split("-->");
    parentId = "ROOT";
    if (activeChainArray.length > 1) {
      activeChainArray.shift();
    }
    return activeChainArray.map((blockId, index) => {
      const markup = (
        <Column key={`level-${index}`}>
          {getMarkupForLevel(localSchema.children, formData, parentId)}
        </Column>
      );
      const activeIndex = localSchema.children.findIndex(
        block => block.id === blockId
      );
      if (activeIndex !== -1) {
        parentId = `${parentId}-->${blockId}`;
        localSchema = localSchema.children[activeIndex];
      } else {
        localSchema = localSchema.children[0];
      }
      return markup;
    });
  }
  return (
    <StyledDetails>
      <StyledSummary>
        <SummaryText type="caption">Activity Details</SummaryText>
      </StyledSummary>
      <Well mainAxis="flex-start">
        {getMarkupTillActiveChain(schema, mdata, activeChain)}
      </Well>
    </StyledDetails>
  );
}
