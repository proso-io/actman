/**
 *
 * ActivityDetails
 *
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import styled from "styled-components";
import { ChevronRight } from "styled-icons/boxicons-regular/ChevronRight";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import {
  makeSelectActivityData,
  makeSelectActivityDetailsState
} from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";
import { getActivityAction } from "./actions";
import Text from "components/Text";
import FlexContainer from "../../components/FlexContainer";
import Spacing from "../../components/Spacing";
import TextDetails from "./TextDetails";
import MediaDetails from "./MediaDetails";
import CommentDetails from "./CommentDetails";

const PageContainer = styled.div`
  padding-top: ${props => props.theme.spacing.thirtysix};
`;

export function ActivityDetails(props) {
  useInjectReducer({ key: "activityDetails", reducer });
  useInjectSaga({ key: "activityDetails", saga });
  let schema, mdata;
  const activityId = props.match.params.activityId;
  if (props.activityDetails) {
    schema = props.activityDetails.schema;
    mdata = props.activityDetails.mdata;
  }
  useEffect(() => {
    if (!props.activityDetailsState) {
      props.getActivityDetails(activityId);
    }
  });

  return (
    <div>
      <Helmet>
        <title>Activity Details</title>
        <meta name="description" content="Description of ActivityDetails" />
      </Helmet>
      <PageContainer>
        {props.activityDetails ? (
          <div>
            <TextDetails schema={schema} mdata={mdata} />
            <MediaDetails schema={schema} mdata={mdata} />
            <CommentDetails />
          </div>
        ) : (
          ""
        )}
      </PageContainer>
    </div>
  );
}

ActivityDetails.propTypes = {
  getActivityDetails: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  activityDetails: makeSelectActivityData(),
  activityDetailsState: makeSelectActivityDetailsState()
});

function mapDispatchToProps(dispatch) {
  return {
    getActivityDetails: activityId => dispatch(getActivityAction(activityId))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(ActivityDetails);
