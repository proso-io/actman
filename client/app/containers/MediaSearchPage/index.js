/**
 *
 * MediaSearchPage
 *
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import makeSelectMediaSearchPage from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import styled from "styled-components";

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

const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ImageTagsContainer = styled.div`
  width: 30%;
  height: 300px;
  background: ${props => props.theme.white};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  margin-bottom: ${props => props.theme.spacing.twentyfour};
  margin-left: ${props => props.theme.spacing.twelve};
  border: 1px solid
    ${props => (props.selected ? props.theme.primary40 : "transparent")};
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

  & .tag {
    color: initial;
    text-decoration: none;
  }

  & .tag__cross {
    display: none;
  }
`;

export function MediaSearchPage(props) {
  useInjectReducer({ key: "mediaSearchPage", reducer });
  useInjectSaga({ key: "mediaSearchPage", saga });

  const [searchTags, setSearchTags] = useState([]);

  return (
    <div>
      <Helmet>
        <title>Search media</title>
        <meta name="description" content="Description of MediaSearchPage" />
      </Helmet>
      <Spacing spacing="thirtysix" />
      <Text type="caption">Search media</Text>
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
      {props.mediaSearchPage.searchResult &&
      props.mediaSearchPage.searchResult.length > 0
        ? `Showing recent ${
            props.mediaSearchPage.searchResult.length
          } results for activities containing keywords ${searchTags.join(", ")}`
        : ""}
      <Spacing spacing="twentyfour" />
      <ResultsContainer>
        {props.mediaSearchPage.searchResult &&
          props.mediaSearchPage.searchResult.map(item => (
            <ImageTagsContainer key={image.fileUrl} onClick={() => {}}>
              <MediaImageContainer>
                <StyledImage src={image.turl} />
              </MediaImageContainer>
              <MediaTagsContainer value={image.tags} />
            </ImageTagsContainer>
          ))}
      </ResultsContainer>
    </div>
  );
}

MediaSearchPage.propTypes = {
  search: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  mediaSearchPage: makeSelectMediaSearchPage()
});

function mapDispatchToProps(dispatch) {
  return {
    search: tags => dispatch(searchRequestAcion(tags)),
    resetSearch: () => dispatch(resetSearchResultsAction())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(MediaSearchPage);
