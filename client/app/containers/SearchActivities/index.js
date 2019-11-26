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

import { Tags } from "@proso-io/fobu/dist/components";
import Button from "components/Button";
import FlexContainer from "components/FlexContainer";
import { searchRequestAcion } from "./actions";
import ActivityTile from "components/ActivityTile";

const TagsContainer = styled.div`
  background: ${props => props.theme.secondary};
  margin: ${props => props.theme.spacing.sixteen};
  padding: ${props => props.theme.spacing.sixteen}
    ${props => props.theme.spacing.thirtysix};
  display: inline-flex;
  width: 100%;
`;

const StyledTags = styled(Tags)`
  width: 100%;
  margin-right: ${props => props.theme.spacing.sixteen};
  .tags__newInput {
    width: 100%;
    height: 100%;
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export function SearchActivities(props) {
  useInjectReducer({ key: "searchActivities", reducer });
  useInjectSaga({ key: "searchActivities", saga });

  const [searchTags, setSearchTags] = useState([]);

  return (
    <div>
      <Helmet>
        <title>SearchActivities</title>
        <meta name="description" content="Description of SearchActivities" />
      </Helmet>
      <TagsContainer>
        <StyledTags
          id="tags"
          label="Search By Tags"
          value={searchTags}
          onValueChange={(id, tags) => setSearchTags(tags)}
        />
        <Button text="Search" onClick={() => props.search(searchTags)} />
      </TagsContainer>
      <ResultsContainer>
        {props.searchActivities.searchResult &&
          props.searchActivities.searchResult.map(item => (
            <ActivityTile
              programName={item.programName}
              imageUrls={[
                "https://images.unsplash.com/photo-1574441170839-b40201becb6b"
              ]}
            />
          ))}
      </ResultsContainer>
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
    search: tags => dispatch(searchRequestAcion(tags))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(SearchActivities);
