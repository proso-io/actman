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

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import reducer from "./reducer";
import saga from "./saga";

import { ThemeProvider } from "styled-components";

import GlobalStyle from "../../global-styles";
import { defaultTheme } from "../../theme";
import PageHeader from "../../components/PageHeader";
import FlexContainer from "../../components/FlexContainer";

import makeSelectLoginPage from "containers/LoginPage/selectors";

import { makeSelectUserData, makeSelectUserFetchingState } from "./selectors";

import LoginPage from "containers/LoginPage";
import HomePage from "containers/HomePage";
import NotFoundPage from "containers/NotFoundPage";
import SideMenu from "../../components/SideMenu";
import EditSchemaPage from "containers/EditSchemaPage";

import {
  USER_REQUEST_ACTION,
  USER_RESPONSE_ACTION,
  CURRENT_USER_ENDPOINT,
  CURRENT_USER_REQUEST_FAILED,
  CURRENT_USER_REQUEST_IN_PROGRESS,
  CURRENT_USER_REQUEST_SUCCEEDED,
  USER_NOT_FETCHED
} from "./constants";

const PageBody = styled.div`
  padding-left: ${props => props.theme.spacing.twentyfour};
  overflow: auto;
  width: 100%;
`;

const PageRightContainer = styled.div`
  padding-left: 300px;
  overflow-x: hidden;
`;

const DashboardLayout = function(props) {
  console.log("Dashboar layout props", props);

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
              <Route exact path="/schemas/:schema" component={EditSchemaPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </PageBody>
        </FlexContainer>
      </PageRightContainer>
    </FlexContainer>
  );
};

function App(props) {
  console.log("App props", props);
  useInjectReducer({ key: "appPage", reducer });
  useInjectSaga({ key: "appPage", saga });
  useEffect(() => {
    console.log(
      "in use effect",
      props.userData,
      !props.userData,
      props.currentUserFetchStatus
    );
    if (
      !props.userData &&
      (!props.currentUserFetchStatus ||
        props.currentUserFetchStatus === USER_NOT_FETCHED)
    ) {
      props.onLoaded();
    }
  });
  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        {props.fetchingCurrentUser && false ? (
          <p>Loading...</p>
        ) : (
          <div>
            {props.userData &&
            props.currentUserFetchStatus !== CURRENT_USER_REQUEST_FAILED ? (
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
