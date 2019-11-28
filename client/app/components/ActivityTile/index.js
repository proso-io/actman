/**
 *
 * ActivityTile
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FlexContainer from "../FlexContainer";
import Text from "../Text";
import Spacing from "../Spacing";
import { Comments } from "styled-icons/fa-regular/Comments";
import { Images } from "styled-icons/fa-regular/Images";

const ActivityTileContainer = styled.div`
  width: 200px;
  height: 300px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.16);
`;

const ActivityTileHeaderContainer = styled.div`
  height: 200px;
  width: 100%;
`;

const ActivityTileBodyContainer = styled.div`
  height: 100px;
  width: 100%;
  padding: ${props => props.theme.spacing.twelve};
  background: ${props => props.theme.white};
`;

const ActivityStatsContainer = styled(FlexContainer)`
  margin-top: auto;
`;

const ActivityStatContainer = styled.div`
  margin-right: ${props => props.theme.spacing.eight};
`;

const ActivityImageContainer = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url(${props => props.imageUrl});
  background-size: cover;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`;

const StyledComments = styled(Comments)`
  color: ${props => props.theme.primary60};
  width: ${props => props.theme.fontSizes.body};
  margin-right: ${props => props.theme.spacing.four};
`;

const StyledImages = styled(Images)`
  color: ${props => props.theme.primary60};
  width: ${props => props.theme.fontSizes.body};
  margin-right: ${props => props.theme.spacing.four};
`;

const ColoredDefault = styled.div`
  width: 100%;
  height: 100%;
  background: #ffd1d1;
`;

function ActivityTile(props) {
  const {
    imageUrls,
    programName,
    location,
    startDate,
    endDate,
    commentsCount
  } = props;
  return (
    <ActivityTileContainer>
      <ActivityTileHeaderContainer>
        {imageUrls.length > 0 ? (
          <ActivityImageContainer imageUrl={imageUrls[0]}>
            <StyledImage src={imageUrls[0]} />
          </ActivityImageContainer>
        ) : (
          <ColoredDefault />
        )}
      </ActivityTileHeaderContainer>
      <ActivityTileBodyContainer>
        <FlexContainer
          direction="column"
          mainAxis="flex-start"
          crossAxis="flex-start"
          height="100%"
        >
          <Text type="body" weight="semibold">
            {programName} {location}
          </Text>
          <Spacing spacing="four" />
          {startDate && endDate ? (
            <Text type="small" color="primary60">
              {startDate} to {endDate}
            </Text>
          ) : (
            ""
          )}

          <ActivityStatsContainer mainAxis="flex-start">
            <ActivityStatContainer>
              <FlexContainer>
                <StyledImages />
                <Text type="small" color="primary60">
                  {" "}
                  {imageUrls.length}
                </Text>
              </FlexContainer>
            </ActivityStatContainer>
            <ActivityStatContainer>
              <FlexContainer>
                <StyledComments />
                <Text type="small" color="primary60">
                  {commentsCount}
                </Text>
              </FlexContainer>
            </ActivityStatContainer>
          </ActivityStatsContainer>
        </FlexContainer>
      </ActivityTileBodyContainer>
    </ActivityTileContainer>
  );
}

ActivityTile.propTypes = {
  programName: PropTypes.string,
  location: PropTypes.string,
  imageUrls: PropTypes.arrayOf(PropTypes.string),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  commentsCount: PropTypes.number
};

export default ActivityTile;
