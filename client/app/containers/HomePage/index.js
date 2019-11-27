/**
 *
 * HomePage
 *
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import styled from "styled-components";

import { Tags } from "@proso-io/fobu/dist/components";
import Button from "components/Button";
import FlexContainer from "components/FlexContainer";
import { searchRequestAcion } from "./actions";
import ActivityTile from "components/ActivityTile";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import makeSelectHomePage from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import { makeSelectUserData } from "containers/App/selectors";

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

export function HomePage(props) {
  useInjectReducer({ key: "homePage", reducer });
  useInjectSaga({ key: "homePage", saga });

  useEffect(() => {
    if (props.homePage.searchStatus === NOT_SEARCHED) {
      props.search();
    }
  });

  const activities = getGroupedActivities(props);

  return (
    <div>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="Description of HomePage" />
      </Helmet>

      {activities &&
        activities.map(group => {
          return (
            <div>
              {group.label && <p>{group.label}</p>}
              <ResultsContainer>
                {group.values &&
                  group.values.map(item => (
                    <ActivityTile
                      programName={item.programName}
                      imageUrls={[
                        "https://images.unsplash.com/photo-1574441170839-b40201becb6b"
                      ]}
                    />
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
    search: () => dispatch(searchRequestAcion())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(HomePage);
