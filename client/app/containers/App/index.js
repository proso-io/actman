/**
 *
 * App
 *
 */

import React, { useEffect } from "react";
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
import { makeSelectUserData, makeSelectUserFetchingState } from "./selectors";

import LoginPage from "containers/LoginPage";
import YourFormsPage from "containers/YourFormsPage";
import HomePage from "containers/HomePage";
import NotFoundPage from "containers/NotFoundPage";
import RecordActivityPage from "containers/RecordActivityPage";
import EditSchemaPage from "containers/EditSchemaPage";
import ActivityDetails from "containers/ActivityDetails";

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

const DashboardLayout = function(props) {
  const userData = props.userData || { teams: [] };

  return (
    <FlexContainer mainAxis="stretch" crossAxis="flex-start">
      <SideMenu
        user={{
          activeTeamIndex: 0,
          ...userData
        }}
        actions={[
          { title: "Home", link: "/", isActive: true },
          { title: "Record an activity", link: "/record" },
          { title: "Quick Upload Images", link: "/quick-upload" }
        ]}
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
                path="/activities/:activityId"
                component={ActivityDetails}
              />
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
  currentUserFetchStatus: makeSelectUserFetchingState()
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
