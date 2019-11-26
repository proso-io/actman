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

export function MediaSearchPage(props) {
  useInjectReducer({ key: "mediaSearchPage", reducer });
  useInjectSaga({ key: "mediaSearchPage", saga });

  const [searchTags, setSearchTags] = useState([]);

  return (
    <div>
      <Helmet>
        <title>MediaSearchPage</title>
        <meta name="description" content="Description of MediaSearchPage" />
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
        {props.mediaSearchPage.searchResult &&
          props.mediaSearchPage.searchResult.map(item => (
            <ActivityTile programName={item.tags} imageUrls={[item.turl]} />
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
    search: tags => dispatch(searchRequestAcion(tags))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(MediaSearchPage);
