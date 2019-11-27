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
  makeSelectActivityDetailsState,
  makeSelectUpdateActivityDetailsState
} from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";
import {
  getActivityAction,
  updateActivityAction,
  updateAddonRequestAction,
  updateAddonResponseAction
} from "./actions";
import Text from "components/Text";
import FlexContainer from "../../components/FlexContainer";
import Spacing from "../../components/Spacing";
import TextDetails from "./TextDetails";
import MediaDetails from "./MediaDetails";
import CommentDetails from "./CommentDetails";
import Button from "../../components/Button";
import { Input } from "@proso-io/fobu/dist/components";

const PageContainer = styled.div`
  padding-top: ${props => props.theme.spacing.thirtysix};
`;

const ActionsBar = styled.div`
  position: sticky;
  width: 100%;
  margin-left: -${props => props.theme.spacing.twentyfour};
  padding: ${props => props.theme.spacing.twentyfour};
  border-bottom: 1px solid ${props => props.theme.primary80};
`;

const ProjectInput = styled(Input)`
  margin-bottom: 0 !important;

  & label.input__label {
    margin-bottom: 0;
  }

  & input.input {
    height: 40px;
  }
`;

export function ActivityDetails(props) {
  useInjectReducer({ key: "activityDetails", reducer });
  useInjectSaga({ key: "activityDetails", saga });
  let schema, mdata, addonsmetadata, addonsData;
  const activityId = props.match.params.activityId;

  if (props.activityDetails) {
    schema = props.activityDetails.schema;
    mdata = props.activityDetails.mdata;
    addonsmetadata = props.activityDetails.addonsmetadata;
  }
  useEffect(() => {
    if (!props.activityDetailsState) {
      props.getActivityDetails(activityId);
    }
  });

  function updateAddon(type, valueObj) {
    props.updateAddonData({
      entityId: activityId,
      addOnType: type,
      addOnValue: valueObj,
      entity: "activity"
    });
  }

  if (addonsmetadata) {
    addonsData = addonsmetadata[Object.keys(addonsmetadata)[0]];
  }

  const [projectName, setProjectName] = useState(
    addonsData ? addonsData["project"] || "" : ""
  );

  return (
    <div>
      <Helmet>
        <title>Activity Details</title>
        <meta name="description" content="Activity Details" />
      </Helmet>
      <ActionsBar>
        <FlexContainer mainAxis="space-between">
          <div style={{ width: "50%" }}>
            <FlexContainer mainAxis="flex-start">
              <Button
                type="primary"
                text={
                  addonsData && addonsData["is-verified"]
                    ? "Marked as verified"
                    : "Mark as verified"
                }
                disabled={addonsData && addonsData["is-verified"]}
                onClick={() =>
                  updateAddon("is-activity-verified", { status: true })
                }
              />
              <Spacing type="horizontal" spacing="sixteen" />
              <Button
                type="secondary"
                text={
                  addonsData && addonsData["is-special"]
                    ? "Marked as special"
                    : "Mark as special"
                }
                disabled={addonsData && addonsData["is-special"]}
                onClick={() =>
                  updateAddon("is-activity-special", { status: true })
                }
              />
            </FlexContainer>
          </div>
          <div className="fobuComponents" style={{ width: "50%" }}>
            <FlexContainer mainAxis="flex-end">
              <ProjectInput
                id="project-name"
                placeholder="Eg. Google"
                value={projectName}
                onValueChange={(id, value) => setProjectName(value)}
              />
              <Spacing type="horizontal" spacing="eight" />
              <Button
                type="secondary"
                text="Add project"
                onClick={() => {
                  updateAddon("project", { project: projectName });
                }}
              />
            </FlexContainer>
          </div>
        </FlexContainer>
      </ActionsBar>
      <PageContainer>
        {props.activityDetails ? (
          <div>
            <TextDetails schema={schema} mdata={mdata} />
            <MediaDetails
              onUpdateActivityDetails={updatedMdata => {
                let activityData = Object.assign({}, props.activityDetails);
                delete activityData["schema"];
                delete activityData["_id"];
                delete activityData["programName"];
                activityData.mdata = updatedMdata;
                props.updateActivityDetails(activityData);
              }}
              addonsmetadata={addonsmetadata}
              updateAddonData={props.updateAddonData}
              schema={schema}
              mdata={mdata}
            />
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
  activityDetailsState: makeSelectActivityDetailsState(),
  updateActivityState: makeSelectUpdateActivityDetailsState()
});

function mapDispatchToProps(dispatch) {
  return {
    getActivityDetails: activityId => dispatch(getActivityAction(activityId)),
    updateActivityDetails: payload => dispatch(updateActivityAction(payload)),
    updateAddonData: data => dispatch(updateAddonRequestAction(data))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(ActivityDetails);
