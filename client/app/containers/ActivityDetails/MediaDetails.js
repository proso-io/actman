import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Text from "components/Text";
import FlexContainer from "../../components/FlexContainer";
import Spacing from "../../components/Spacing";
import { Tags } from "@proso-io/fobu/dist/components";
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

const ActionsContainer = styled.div`
  width: 30%;
`;

const MediaContainer = styled(FlexContainer)`
  width: 70%;
`;

const TagsContainer = styled.div`
  background: ${props => props.theme.primary20};
  max-height: 150px;
  overflow-y: scroll;
  width: 80%;
  padding: ${props => props.theme.spacing.sixteen};
  cursor: pointer;
`;

const ImageTagsContainer = styled.div`
  width: 30%;
  height: 300px;
  background: ${props => props.theme.white};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  margin-bottom: ${props => props.theme.spacing.twentyfour};
  margin-left: ${props => props.theme.spacing.twelve};
`;

const MediaImageContainer = styled.div`
  height: 220px;
  width: 100%;
  overflow: hidden;
  background: ${props => props.theme.primary80};
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`;

const MediaTagsContainer = styled(Tags)`
  height: 80px;
  padding: ${props => props.theme.spacing.eight};
  width: 100%;

  & input.tags__newInput {
    display: none;
  }

  & div.tags__wrapper {
    box-shadow: none;
    padding: 0;
    min-height: auto;
    overflow-y: scroll;
  }

  & .tag__cross {
    display: none;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.secondary};
  font-size: ${props => props.theme.fontSizes.small};
`;

function getUniqueTags(mdata) {
  let uniqueTags = [];
  for (let key in mdata) {
    if (key.indexOf("imagesWithTags") !== -1) {
      mdata[key].forEach(image => {
        image.tags.forEach(tag => {
          if (uniqueTags.indexOf(tag) === -1) {
            uniqueTags.push(tag);
          }
        });
      });
    }
  }
  return uniqueTags;
}

function getAllImages(mdata, activeTag) {
  let allImages = [];
  Object.keys(mdata)
    .filter(key => key.indexOf("imagesWithTags") !== -1)
    .forEach(key => {
      let images = mdata[key];
      if (activeTag) {
        images = images.filter(image => image.tags.indexOf(activeTag) !== -1);
      }
      allImages = [].concat(allImages, images);
    });
  return allImages;
}

export default function MediaDetails({ schema, mdata }) {
  const [activeTag, setActiveTag] = useState(null);
  const visibleImages = getAllImages(mdata, activeTag);

  return (
    <StyledDetails>
      <StyledSummary>
        <SummaryText type="caption">Activity Media</SummaryText>
      </StyledSummary>

      <Well mainAxis="flex-start">
        <div className="fobuComponents" style={{ width: "100%" }}>
          <FlexContainer mainAxis="stretch" crossAxis="flex-start" width="100%">
            <ActionsContainer>
              <TagsContainer>
                <FlexContainer mainAxis="space-between" width="100%">
                  <Text type="body" weight="semibold" color="secondary">
                    TAGS
                  </Text>
                  {activeTag !== null ? (
                    <StyledLink
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setActiveTag(null);
                      }}
                    >
                      Clear
                    </StyledLink>
                  ) : (
                    ""
                  )}
                </FlexContainer>

                <Spacing spacing="eight" />
                {getUniqueTags(mdata).map(tag => (
                  <Text
                    type="body"
                    case="title"
                    color="secondary"
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                    <Spacing spacing="four" />
                  </Text>
                ))}
              </TagsContainer>
            </ActionsContainer>
            <MediaContainer wrap="wrap" mainAxis="flex-start">
              {visibleImages.map((image, index) => (
                <ImageTagsContainer>
                  <MediaImageContainer>
                    <StyledImage src={image.fileUrl} />
                  </MediaImageContainer>
                  <MediaTagsContainer value={image.tags} />
                </ImageTagsContainer>
              ))}
            </MediaContainer>
          </FlexContainer>
        </div>
      </Well>
    </StyledDetails>
  );
}
