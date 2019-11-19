/**
 *
 * LoginPage
 *
 */

import React from "react";
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

import Button from "../../components/Button";

export function LoginPage() {
  useInjectReducer({ key: "loginPage", reducer });
  useInjectSaga({ key: "loginPage", saga });

  return (
    <div>
      <Helmet>
        <title>Login Page</title>
        <meta name="description" content="Description of LoginPage" />
      </Helmet>
      <Button
        text={<FormattedMessage {...messages.submit} />}
        onClick={()=>{console.log("Button CLicked");}}
        />
    </div>
  );
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(LoginPage);
