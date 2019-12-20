import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Text from "components/Text";
import FlexContainer from "../../components/FlexContainer";
import Spacing from "components/Spacing";
import Button from "components/Button";
import Link from "components/Link";
import { Tags, Input } from "@proso-io/fobu/dist/components";
import { UPDATING_ADDON } from "./constants";
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

const ImageTagsContainer = styled.a`
  width: 30%;
  height: 300px;
  background: ${props => props.theme.white};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  margin-bottom: ${props => props.theme.spacing.twentyfour};
  margin-left: ${props => props.theme.spacing.twelve};
  border: 1px solid
    ${props => (props.selected ? props.theme.primary40 : "transparent")};
`;

const MediaImageContainer = styled(FlexContainer)`
  height: 220px;
  width: 100%;
  overflow: hidden;
  background: ${props => props.theme.secondary};
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

  & .tag {
    color: initial;
    text-decoration: none !important;
  }

  & .tag__cross {
    display: none;
  }
`;

const StyledButton = styled(Button)`
  background: ${props => props.theme.primary40};
  width: 100%;
`;

const MediaActionsContainer = styled.div`
  background: ${props => props.theme.primary80};
  min-height: 150px;
  width: 80%;
  padding: ${props => props.theme.spacing.sixteen};
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

function getUpdateMdata(mdata, selectedImages, tagInputText) {
  for (let key in mdata) {
    if (key.indexOf("imagesWithTags") !== -1) {
      let images = mdata[key];
      // get all selected images in this key
      let filteredImages = images.filter(
        image => selectedImages.indexOf(image.fileUrl) !== -1
      );
      // add the new tag
      filteredImages.forEach(image => {
        image.tags.push(tagInputText);
      });
    }
  }
  return mdata;
}

export default function MediaDetails({
  schema,
  mdata,
  addonsmetadata,
  updateAddon,
  onUpdateActivityDetails,
  allowTagsEdit,
  allowMediaVerification,
  addonState,
  updateAddonType
}) {
  const [activeTag, setActiveTag] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [tagInputText, setTagInputText] = useState("");

  const visibleImages = getAllImages(mdata, activeTag);

  const entity = "MediaMetaData";

  const isLoading = addonState === UPDATING_ADDON;

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
                    <Link
                      fontSize="small"
                      color="secondary"
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setActiveTag(null);
                      }}
                    >
                      Clear
                    </Link>
                  ) : (
                    ""
                  )}
                </FlexContainer>

                <Spacing spacing="eight" />
                {getUniqueTags(mdata).map(tag => (
                  <Text
                    key={tag}
                    type="body"
                    case="title"
                    color={tag === activeTag ? "primary60" : "secondary"}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                    <Spacing spacing="four" />
                  </Text>
                ))}
              </TagsContainer>
              <Spacing spacing="twentyfour" />
              <StyledButton
                onClick={() => {
                  setSelectMode(!selectMode);
                  setSelectedImages([]);
                }}
                themeType="secondary"
              >
                {selectMode ? "De-select images" : "Select images"}
              </StyledButton>
              <Spacing spacing="twentyfour" />
              {selectedImages.length > 0 ? (
                <MediaActionsContainer>
                  <FlexContainer
                    direction="column"
                    mainAxis="flex-start"
                    crossAxis="flex-start"
                  >
                    {allowTagsEdit && (
                      <div>
                        <Text type="body" weight="semibold">
                          Bulk add tags
                        </Text>
                        <Input
                          id="bulk-add-tags"
                          value={tagInputText}
                          onValueChange={(id, value) => {
                            setTagInputText(value);
                          }}
                        />
                        <Button
                          themeType="primary"
                          onClick={() => {
                            const updatedMdata = getUpdateMdata(
                              mdata,
                              selectedImages,
                              tagInputText
                            );
                            onUpdateActivityDetails(updatedMdata);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}

                    <Spacing spacing="thirtysix" />
                    <Text type="body" color="primary60">
                      ACTIONS
                    </Text>
                    <Spacing spacing="eight" />
                    {allowMediaVerification && (
                      <Link
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          selectedImages.forEach(image => {
                            const mediaId = image.match(
                              /\/api\/media\/(.*)\/thumbnail/
                            )[1];
                            updateAddon(entity, mediaId, "is-media-verified", {
                              status: true
                            });
                          });
                        }}
                      >
                        <Text type="body">
                          {isLoading && updateAddonType === "is-media-verified"
                            ? "Marking..."
                            : "Mark as verified"}
                        </Text>
                      </Link>
                    )}
                    <Spacing spacing="four" />
                    <Link
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        selectedImages.forEach(imageUrl => {
                          let elem = document.createElement("a");
                          elem.href = imageUrl;
                          elem.setAttribute("download", true);
                          elem.click();
                        });
                      }}
                    >
                      <Text type="body">Download all</Text>
                    </Link>
                  </FlexContainer>
                </MediaActionsContainer>
              ) : (
                ""
              )}
            </ActionsContainer>
            <MediaContainer wrap="wrap" mainAxis="flex-start">
              {visibleImages.map((image, index) => (
                <ImageTagsContainer
                  key={image.fileUrl}
                  href={selectMode ? "#" : image.fileUrl}
                  target="_blank"
                  selected={selectedImages.indexOf(image.fileUrl) > -1}
                  onClick={
                    selectMode
                      ? e => {
                          e.preventDefault();
                          const index = selectedImages.indexOf(image.fileUrl);
                          let newSelectedImages = [].concat(selectedImages);
                          if (index !== -1) {
                            newSelectedImages.splice(index, 1);
                            setSelectedImages(newSelectedImages);
                          } else {
                            let newSelectedImages = [].concat(selectedImages);
                            newSelectedImages.push(image.fileUrl);
                            setSelectedImages(newSelectedImages);
                          }
                        }
                      : () => {}
                  }
                >
                  <MediaImageContainer direction="column">
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
