/**
 *
 * SearchActivities
 *
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import { Helmet } from "react-helmet";
import makeSelectSearchActivities from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import styled from "styled-components";
import { push } from "connected-react-router";

import { Tags } from "@proso-io/fobu/dist/components";
import Button from "components/Button";
import FlexContainer from "components/FlexContainer";
import { searchRequestAcion, resetSearchResultsAction } from "./actions";
import ActivityTile from "components/ActivityTile";
import Text from "components/Text";
import Spacing from "components/Spacing";

const TagsContainer = styled.div`
  background: ${props => props.theme.secondary};
  padding: ${props => props.theme.spacing.sixteen};
  width: 60%;
`;

const StyledTags = styled(Tags)`
  width: 90%;
  min-height: 80px;
  margin-right: ${props => props.theme.spacing.sixteen};

  & label.tags__label {
    margin-bottom: 0;
  }
`;

function getFieldFromMdata(mdata, field) {
  for (let key in mdata) {
    if (key.indexOf(field) !== -1) {
      return mdata[key];
    }
  }
  return "";
}

function getAllImages(mdata) {
  let allImages = [];
  Object.keys(mdata)
    .filter(key => key.indexOf("imagesWithTags") !== -1)
    .forEach(key => {
      let images = mdata[key];
      allImages = [].concat(allImages, images.map(image => image.fileUrl));
    });
  return allImages;
}

const ActivityTileContainer = styled.div`
  margin-left: ${props => props.theme.spacing.twentyfour};
  margin-bottom: ${props => props.theme.spacing.twentyfour};

  :first-child {
    margin-left: 0;
  }
`;

export function SearchActivities(props) {
  useInjectReducer({ key: "searchActivities", reducer });
  useInjectSaga({ key: "searchActivities", saga });

  const [searchTags, setSearchTags] = useState([]);

  return (
    <div>
      <Helmet>
        <title>Search activities</title>
        <meta name="description" content="Description of SearchActivities" />
      </Helmet>
      <Spacing spacing="thirtysix" />
      <Text type="caption">Search activities</Text>
      <Spacing spacing="sixteen" />
      <div className="fobuComponents">
        <TagsContainer>
          <FlexContainer mainAxis="flex-start" crossAxis="flex-start">
            <StyledTags
              id="tags"
              value={searchTags}
              onValueChange={(id, tags) => {
                setSearchTags(tags);
                props.resetSearch();
              }}
            />
            <Button onClick={() => props.search(searchTags)}>Search</Button>
          </FlexContainer>
        </TagsContainer>
      </div>
      <Spacing spacing="thirtysix" />
      {props.searchActivities.searchResult &&
      props.searchActivities.searchResult.length > 0
        ? `Showing recent ${
            props.searchActivities.searchResult.length
          } results for activities containing keywords ${searchTags.join(", ")}`
        : ""}
      <Spacing spacing="twentyfour" />
      <FlexContainer mainAxis="flex-start" wrap="wrap">
        {props.searchActivities.searchResult &&
          props.searchActivities.searchResult.map(item => (
            <ActivityTileContainer
              onClick={() => props.push(`/activities/${item._id}`)}
            >
              <ActivityTile
                programName={item.programName}
                location={getFieldFromMdata(item.mdata, "location")}
                imageUrls={getAllImages(item.mdata)}
                startDate={getFieldFromMdata(item.mdata, "startDate")}
                endDate={getFieldFromMdata(item.mdata, "endDate")}
                commentsCount="0"
              />
            </ActivityTileContainer>
          ))}
      </FlexContainer>
    </div>
  );
}

SearchActivities.propTypes = {
  search: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  searchActivities: makeSelectSearchActivities()
});

function mapDispatchToProps(dispatch) {
  return {
    search: tags => dispatch(searchRequestAcion(tags)),
    resetSearch: () => dispatch(resetSearchResultsAction()),
    push: payload => dispatch(push(payload))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(SearchActivities);
