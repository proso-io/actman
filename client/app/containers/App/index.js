/**
 *
 * App
 *
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { userRequestAction } from "./actions";
import { toast } from "react-toastify";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import reducer from "./reducer";
import saga from "./saga";

import { ThemeProvider } from "styled-components";

import GlobalStyle from "../../global-styles";
import { defaultTheme } from "../../theme";
import PageHeader from "../../components/PageHeader";
import FlexContainer from "../../components/FlexContainer";
import SideMenu from "../../components/SideMenu";

import makeSelectLoginPage from "containers/LoginPage/selectors";
import {
  makeSelectUserData,
  makeSelectUserFetchingState,
  makeSelectUserPerms
} from "./selectors";

import LoginPage from "containers/LoginPage";
import YourFormsPage from "containers/YourFormsPage";
import HomePage from "containers/HomePage";
import NotFoundPage from "containers/NotFoundPage";
import RecordActivityPage from "containers/RecordActivityPage";
import EditSchemaPage from "containers/EditSchemaPage";
import ActivityDetails from "containers/ActivityDetails";
import SearchActivities from "containers/SearchActivities";
import MediaSearchPage from "containers/MediaSearchPage";

import "react-toastify/dist/ReactToastify.css";

import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  CURRENT_USER_ENDPOINT,
  CURRENT_USER_REQUEST_FAILED,
  CURRENT_USER_REQUEST_IN_PROGRESS,
  CURRENT_USER_REQUEST_SUCCEEDED,
  USER_NOT_FETCHED
} from "./constants";

toast.configure();

const PageBody = styled.div`
  padding-left: ${props => props.theme.spacing.twentyfour};
  overflow: auto;
  width: 100%;
  min-height: 100vh;
`;

const PageRightContainer = styled.div`
  padding-left: 300px;
  overflow-x: hidden;
  flex: 1;
`;

const allLinks = [
  { title: "Home", link: "/" },
  {
    title: "Record an activity",
    link: "/record-activity",
    requiredPerm: "Activities__create"
  },
  { title: "Your forms", link: "/forms", requiredPerm: "FormSchemas__view" },
  {
    title: "Search Activities",
    link: "/activities/search",
    requiredPerm: "Activities__view"
  },
  {
    title: "Search Media",
    link: "/media/search",
    requiredPerm: "MediaMetaData__view"
  }
];

function getSidemenuLinks(userPermissions, activeLink) {
  let links = allLinks.filter(link => {
    let val,
      requiredPerm = link.requiredPerm;
    for (let index = 0; index < userPermissions.length; index++) {
      const element = userPermissions[index];
      const elementPermString = `${element.ent}__${element.opn}`;
      if (requiredPerm) {
        if (elementPermString === requiredPerm) {
          val = true;
          break;
        } else {
          val = false;
        }
      } else {
        val = true;
        break;
      }
    }
    return val;
  });
  links.forEach(linkObj => {
    if (linkObj.link === activeLink) {
      linkObj.isActive = true;
    } else {
      linkObj.isActive = false;
    }
  });
  return links;
}

const DashboardLayout = function(props) {
  const userData = props.userData || { teams: [] };
  const [activeLink, setActiveLink] = useState("/");
  return (
    <FlexContainer mainAxis="stretch" crossAxis="flex-start">
      <SideMenu
        user={{
          activeTeamIndex: 0,
          ...userData
        }}
        onLinkChange={link => setActiveLink(link)}
        actions={getSidemenuLinks(props.perms, activeLink)}
      />
      <PageRightContainer>
        <FlexContainer
          direction="column"
          mainAxis="flex-start"
          crossAxis="flex-start"
        >
          <PageHeader title="Home" />
          <PageBody>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/forms" component={YourFormsPage} />
              <Route
                exact
                path="/record-activity"
                component={RecordActivityPage}
              />
              <Route exact path="/forms/:schema" component={EditSchemaPage} />
              <Route
                exact
                path="/activities/search"
                component={SearchActivities}
              />
              <Route
                exact
                path="/activities/:activityId"
                component={ActivityDetails}
              />
              <Route
                exact
                path="/activities/:activityId/edit"
                component={RecordActivityPage}
              />
              <Route exact path="/media/search" component={MediaSearchPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </PageBody>
        </FlexContainer>
      </PageRightContainer>
    </FlexContainer>
  );
};

function App(props) {
  useInjectReducer({ key: "appPage", reducer });
  useInjectSaga({ key: "appPage", saga });

  const { currentUserFetchStatus, userData } = props;

  useEffect(() => {
    if (!userData && currentUserFetchStatus === USER_NOT_FETCHED) {
      props.onLoaded();
    }
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        {currentUserFetchStatus === USER_NOT_FETCHED ||
        currentUserFetchStatus === CURRENT_USER_REQUEST_IN_PROGRESS ? (
          <p>Loading...</p>
        ) : (
          <div>
            {userData &&
            currentUserFetchStatus !== CURRENT_USER_REQUEST_FAILED ? (
              <DashboardLayout {...props} />
            ) : (
              <Switch>
                <Route exact path="/login" component={LoginPage} />
                <Route component={NotFoundPage} />
              </Switch>
            )}
          </div>
        )}

        {/* <DashboardLayout {...props} /> */}

        <GlobalStyle />
      </div>
    </ThemeProvider>
  );
}

App.propTypes = {
  onLoaded: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
  userData: makeSelectUserData(),
  currentUserFetchStatus: makeSelectUserFetchingState(),
  perms: makeSelectUserPerms()
});

function mapDispatchToProps(dispatch) {
  return {
    onLoaded: () => dispatch(userRequestAction())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(App);
