/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import { compose } from "redux";

import { ThemeProvider } from "styled-components";

import makeSelectLoginPage from "./selectors";

import HomePage from "containers/HomePage/Loadable";
import NotFoundPage from "containers/NotFoundPage/Loadable";
import LoginPage from "containers/LoginPage";
import SideMenu from "../../components/SideMenu";

import GlobalStyle from "../../global-styles";
import { defaultTheme } from "../../theme";
import PageHeader from "../../components/PageHeader";
import FlexContainer from "../../components/FlexContainer";

const PageBody = styled.div`
  padding-left: ${props => props.theme.spacing.twentyfour};
  width: 100%;
`;

const DashboardLayout = function(props) {
  return (
    <FlexContainer mainAxis="stretch" crossAxis="flex-start">
      <SideMenu
        user={{
          name: "saumitra",
          orgName: "Goonj",
          activeTeamIndex: 0,
          teams: [{ id: 0, teamName: "Regional team", unitName: "Bihar" }]
        }}
        actions={[
          { title: "Home", link: "/", isActive: true },
          { title: "Record an activity", link: "/record" },
          { title: "Quick Upload Images", link: "/quick-upload" }
        ]}
      />
      <FlexContainer
        direction="column"
        mainAxis="flex-start"
        crossAxis="flex-start"
        width="100%"
      >
        <PageHeader title="Home" />

        <PageBody>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </PageBody>
      </FlexContainer>
    </FlexContainer>
  );
};

function App(props) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        {props.loginPage.loginStatus !== 1 ? (
          <Switch>
            <Route exact path="/login" component={LoginPage} />
          </Switch>
        ) : (
          <DashboardLayout {...props} />
        )}

        <GlobalStyle />
      </div>
    </ThemeProvider>
  );
}

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
  pathname: state.router.location.pathname
});

function mapDispatchToProps(dispatch) {
  return {
    onLoaded: () => dispatch(loginRequestAction())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default connect(withConnect)(App);
