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

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import makeSelectLoginPage from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";

import { loginRequestAction } from './actions';

import Button from "../../components/Button";

import { Input, FormBuilder } from '@proso-io/fobu';

export function LoginPage(props) {
  useInjectReducer({ key: "loginPage", reducer });
  useInjectSaga({ key: "loginPage", saga });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <Helmet>
        <title>Login Page</title>
        <meta name="description" content="Description of LoginPage" />
      </Helmet>
      <Input
        id="username"
        label={<FormattedMessage {...messages.username} />}
        value={username}
        onValueChange={(id, val) => setUsername(val)}
        />
      <Input
        id="password"
        type="password"
        label={<FormattedMessage {...messages.password} />}
        value={password}
        onValueChange={(id, val) => setPassword(val)}
        />
      <Button
        text={<FormattedMessage {...messages.submit} />}
        onClick={()=>{props.onSubmit(username, password)}}
        />
    </div>
  );
}

LoginPage.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage()
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (username, password) => dispatch(loginRequestAction(username, password))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(LoginPage);
