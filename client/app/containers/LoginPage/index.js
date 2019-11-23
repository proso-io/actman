/**
 *
 * LoginPage
 *
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
import FlexContainer from "../../components/FlexContainer";
import LoginFormCard from "./LoginFormCard";
import StaticNav from "./StaticNav";
import BackgroundContainer from "./BackgroundContainer";

import { Input, FormBuilder } from "@proso-io/fobu/dist/fobu.components";

const StyledInput = styled(Input)`
  > label.input__label {
    color: ${props => props.theme.white};
  }

  > input {
    width: 100%;
  }
`;

function redirectToHome(){
  //this.context.router.history.push('/home');
  window.location.href = "/home";
}

export function LoginPage(props) {
  console.log(props, props.loginPage.loginStatus);
  useInjectReducer({ key: "loginPage", reducer });
  useInjectSaga({ key: "loginPage", saga });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if(props.loginPage.loginStatus === 1){
    redirectToHome();
    return "";
  }

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
          <LoginFormCard {...props}>
            <div className="fobuComponents">
              <StyledInput
                id="username"
                label={<FormattedMessage {...messages.username} />}
                value={username}
                onValueChange={(id, val) => setUsername(val)}
              />
              <StyledInput
                id="password"
                type="password"
                label={<FormattedMessage {...messages.password} />}
                value={password}
                onValueChange={(id, val) => setPassword(val)}
              />
            </div>
            <Button
              text={<FormattedMessage {...messages.submit} />}
              onClick={() => {
                props.onSubmit(username, password);
              }}
            />
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
}

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage()
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (username, password) =>
      dispatch(loginRequestAction(username, password))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(LoginPage);
