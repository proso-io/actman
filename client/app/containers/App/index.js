/**
 *
 * App
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import { ThemeProvider } from "styled-components";

import GlobalStyle from "../../global-styles";
import { defaultTheme } from "../../theme";
import PageHeader from "../../components/PageHeader";
import FlexContainer from "../../components/FlexContainer";

import makeSelectLoginPage from "containers/LoginPage/selectors";

import LoginPage from "containers/LoginPage";
import HomePage from "containers/HomePage";
import NotFoundPage from "containers/NotFoundPage";
import SideMenu from "../../components/SideMenu";

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
  // useEffect(() => {
  //   props.onLoaded();
  // });

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
              <Route component={NotFoundPage} />
            </Switch>
          </PageBody>
        </FlexContainer>
      </PageRightContainer>
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
            <Route component={NotFoundPage} />
          </Switch>
        ) : (
          <DashboardLayout {...props} />
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
  loginPage: makeSelectLoginPage()
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
