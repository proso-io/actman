/**
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { push } from "connected-react-router";

import styled from "styled-components";

import { Tags } from "@proso-io/fobu/dist/components";
import Button from "components/Button";
import Text from "components/Text";
import FlexContainer from "components/FlexContainer";
import Spacing from "components/Spacing";
import { searchRequestAcion } from "./actions";
import ActivityTile from "components/ActivityTile";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import makeSelectHomePage from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import { makeSelectUserData } from "containers/App/selectors";
import FormDataService from "../../services/FormDataService";

import {
  SEARCH_REQUEST_ACTION,
  SEARCH_RESPONSE_ACTION,
  SEARCHING,
  NOT_SEARCHED
} from "./constants";

const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

function doGroupByApproved(props) {
  let approve = false;
  let perm;
  props.userData.perms.map(item => {
    if (item.opn === "view-approved" && item.ent === "Activities") {
      perm = item;
    }
  });
  return perm;
}

function doGroupByVerified(props) {
  let approve = false;
  let perm;
  props.userData.perms.map(item => {
    if (item.opn === "view-verified" && item.ent === "Activities") {
      perm = item;
    }
  });
  return perm;
}

function getGroupedActivities(props) {
  let allActivities = props.homePage.searchResult || [];
  let activities = [];
  let verifiedPerm = doGroupByVerified(props);
  let approvePerm = doGroupByApproved(props);
  if (verifiedPerm || approvePerm) {
    activities = [];
    if (verifiedPerm) {
      activities.push({
        label: "Verified Activities",
        values: []
      });
      if (approvePerm) {
        activities.push({
          label: "Approved Activities",
          values: []
        });
        activities.push({
          label: "Unapproved Activities",
          values: []
        });
      } else {
        activities.push({
          label: "Not Verified Activities",
          values: []
        });
      }
    } else {
      activities = [
        {
          label: "Approved Activities",
          values: []
        },
        {
          label: "Unapproved Activities",
          values: []
        }
      ];
    }
    allActivities.map(act => {
      if (verifiedPerm || approvePerm) {
        if (verifiedPerm && approvePerm) {
          act.addonsmetadata &&
          act.addonsmetadata[verifiedPerm.addon] &&
          act.addonsmetadata[verifiedPerm.addon]["is-verified"]
            ? activities[0].values.push(act)
            : act.addonsmetadata &&
              act.addonsmetadata[approvePerm.addon] &&
              act.addonsmetadata[approvePerm.addon]["is-approved"]
            ? activities[1].values.push(act)
            : activities[2].values.push(act);
        } else if (!approvePerm) {
          act.addonsmetadata &&
          act.addonsmetadata[verifiedPerm.addon] &&
          act.addonsmetadata[verifiedPerm.addon]["is-verified"]
            ? activities[0].values.push(act)
            : activities[1].values.push(act);
        } else {
          act.addonsmetadata &&
          act.addonsmetadata[approvePerm.addon] &&
          act.addonsmetadata[approvePerm.addon]["is-approved"]
            ? activities[0].values.push(act)
            : activities[1].values.push(act);
        }
      } else {
        activities[0].values.push(act);
      }
    });
  } else {
    activities = [
      {
        label: null,
        values: allActivities
      }
    ];
  }
  return activities;
}

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

function chunkArray(arr, n) {
  return arr.reduce((all, cur, i) => {
    const ch = Math.floor(i / n);
    all[ch] = [].concat(all[ch] || [], cur);
    return all;
  }, []);
}

const ActivityTileContainer = styled.div`
  margin-left: ${props => props.theme.spacing.twentyfour};
  margin-bottom: ${props => props.theme.spacing.twentyfour};

  :first-child {
    margin-left: 0;
  }
`;

export function HomePage(props) {
  useInjectReducer({ key: "homePage", reducer });
  useInjectSaga({ key: "homePage", saga });

  const [pendingRequest, setPendingRequest] = useState(null);

  useEffect(() => {
    if (props.homePage.searchStatus === NOT_SEARCHED) {
      props.search();
    }
    FormDataService.hasPendingUploads().then(pendingFormRequest => {
      if (pendingFormRequest && pendingFormRequest.length > 0) {
        setPendingRequest(pendingFormRequest[0]);
      }
    });
  });

  const activities = getGroupedActivities(props);

  return (
    <div>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="Description of HomePage" />
      </Helmet>
      <Spacing spacing="thirtysix" />
      <Text type="subtitle">Your activities</Text>
      <Spacing spacing="twentyfour" />
      <div>
        {pendingRequest && (
          <ActivityTileContainer
            onClick={() => props.push(`/activities/${item._id}/edit`)}
          >
            <ActivityTile
              key="pending"
              programName={
                pendingRequest.requestParams.mergeObj.name || "Uploading..."
              }
              location={""}
              imageUrls={getAllImages(pendingRequest.data)}
              startDate={getFieldFromMdata(pendingRequest.data, "startDate")}
              endDate={getFieldFromMdata(pendingRequest.data, "endDate")}
              commentsCount={0}
            />
            <Spacing spacing="twentyfour" />
          </ActivityTileContainer>
        )}
      </div>
      {activities &&
        activities.map(group => {
          return (
            <div>
              {group.label && <p>{group.label}</p>}
              <ResultsContainer>
                {group.values &&
                  group.values.map(item => (
                    <ActivityTileContainer
                      key={item._id}
                      onClick={() => props.push(`/activities/${item._id}`)}
                    >
                      <ActivityTile
                        programName={item.programName}
                        location={getFieldFromMdata(item.mdata, "location")}
                        imageUrls={getAllImages(item.mdata)}
                        startDate={getFieldFromMdata(item.mdata, "startDate")}
                        endDate={getFieldFromMdata(item.mdata, "endDate")}
                        commentsCount={0}
                      />
                    </ActivityTileContainer>
                  ))}
              </ResultsContainer>
              <br />
            </div>
          );
        })}
    </div>
  );
}

HomePage.propTypes = {
  search: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
  userData: makeSelectUserData()
});

function mapDispatchToProps(dispatch) {
  return {
    search: () => dispatch(searchRequestAcion()),
    push: payload => dispatch(push(payload))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(HomePage);
