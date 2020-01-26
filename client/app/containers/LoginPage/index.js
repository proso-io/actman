/**
 *
 * LoginPage
 *
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import styled from "styled-components";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import makeSelectLoginPage from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";

import { loginRequestAction } from "./actions";

import Button from "../../components/Button";
import Spacing from "../../components/Spacing";
import FlexContainer from "../../components/FlexContainer";
import LoginFormCard from "./LoginFormCard";
import StaticNav from "./StaticNav";
import BackgroundContainer from "./BackgroundContainer";

import { Input } from "@proso-io/fobu/dist/components";

const StyledInput = styled(Input)`
  > label.input__label {
    color: ${props => props.theme.white};
  }

  > input {
    width: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  padding: ${props => props.theme.spacing.twelve};
  border: ${props => props.theme.error};
  background: ${props => props.theme.error60};
`;

export function LoginPage(props) {
  useInjectReducer({ key: "loginPage", reducer });
  useInjectSaga({ key: "loginPage", saga });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (props.loginPage.loginStatus === 1) {
      props.push("/");
    }
  });

  const isLoading = props.loginPage.loginStatus === 0;
  const hasError = props.loginPage.loginStatus === -1;

  return (
    <div>
      <Helmet>
        <title>Login Page</title>
        <meta name="description" content="Description of LoginPage" />
      </Helmet>
      <BackgroundContainer>
        <StaticNav>
          <h2>ActMan</h2>
        </StaticNav>
        <FlexContainer height="100%">
          <LoginFormCard
            {...props}
            onSubmit={e => {
              e.preventDefault();
              props.onSubmit(username, password);
            }}
          >
            <div className="fobuComponents">
              <StyledInput
                id="username"
                required={true}
                label={<FormattedMessage {...messages.username} />}
                value={username}
                onValueChange={(id, val) => setUsername(val)}
              />
              <StyledInput
                id="password"
                type="password"
                required={true}
                label={<FormattedMessage {...messages.password} />}
                value={password}
                onValueChange={(id, val) => setPassword(val)}
              />
            </div>
            <Button type="submit" loading={isLoading} disabled={isLoading}>
              <FormattedMessage {...messages.submit} />
            </Button>

            {hasError && (
              <div>
                <Spacing spacing="twentyfour" />
                <ErrorMessage>
                  Those login details don't sound about right. Try again?
                </ErrorMessage>
              </div>
            )}
          </LoginFormCard>
        </FlexContainer>
      </BackgroundContainer>
    </div>
  );
}

LoginPage.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

LoginPage.contextTypes = {
  router: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage()
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (username, password) =>
      dispatch(loginRequestAction(username, password)),
    push: payload => dispatch(push(payload))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(LoginPage);
