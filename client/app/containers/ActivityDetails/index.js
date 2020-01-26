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

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import {
  makeSelectActivityData,
  makeSelectActivityDetailsState,
  makeSelectUpdateActivityDetailsState,
  makeSelectUpdateAddonState,
  makeSelectUpdateAddonType
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
import TextDetails from "./TextDetails";
import MediaDetails from "./MediaDetails";
import CommentDetails from "./CommentDetails";
import { makeSelectUserPerms } from "../App/selectors";
import ActionsNav from "./ActionsNav";

const PageContainer = styled.div`
  padding-top: ${props => props.theme.spacing.thirtysix};
`;

export function ActivityDetails(props) {
  useInjectReducer({ key: "activityDetails", reducer });
  useInjectSaga({ key: "activityDetails", saga });

  let schema, mdata, addonsmetadata, addonsData;
  const activityId = props.match.params.activityId;

  function updateAddon(entity, entityId, addOnType, valueObj) {
    props.updateAddonData({
      entityId: entityId,
      addOnType: addOnType,
      addOnValue: valueObj,
      entity: entity
    });
  }

  useEffect(() => {
    if (!props.activityDetailsState) {
      props.getActivityDetails(activityId);
    }
  });

  if (props.activityDetails) {
    schema = props.activityDetails.schema;
    mdata = props.activityDetails.mdata;
    addonsmetadata = props.activityDetails.addonsmetadata;
  }

  if (addonsmetadata) {
    addonsData = addonsmetadata[Object.keys(addonsmetadata)[0]];
  }

  return (
    <div>
      <Helmet>
        <title>Activity Details</title>
        <meta name="description" content="Activity Details" />
      </Helmet>
      <ActionsNav
        activityId={activityId}
        updateAddon={updateAddon}
        hasRight={props.hasRight}
        addonsData={addonsData}
        perms={props.perms}
        addonState={props.addonState}
        updateAddonType={props.updateAddonType}
        isFetchingActivity={!props.activityDetails}
      />
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
              updateAddon={updateAddon}
              schema={schema}
              mdata={mdata}
              allowMediaVerification={props.hasRight(
                "MediaMetaData",
                "update-verified",
                props.perms
              )}
              allowTagsEdit={props.hasRight("Activities", "edit", props.perms)}
              addonState={props.addonState}
              updateAddonType={props.updateAddonType}
            />
            <CommentDetails />
          </div>
        ) : (
          <p>Loading..</p>
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
  addonState: makeSelectUpdateAddonState(),
  updateAddonType: makeSelectUpdateAddonType(),
  updateActivityState: makeSelectUpdateActivityDetailsState(),
  perms: makeSelectUserPerms(),
  hasRight: () => (ent, opn, perms) => {
    for (let index = 0; index < perms.length; index++) {
      const element = perms[index];
      if (ent === element.ent && opn === element.opn) {
        return true;
      }
    }

    return false;
  }
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
