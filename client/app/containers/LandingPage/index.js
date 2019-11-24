/**
 *
 * LandingPage
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
import makeSelectLandingPage from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";

import { FormBuilder, Input } from "@proso-io/fobu/dist/fobu.components";

export function LandingPage() {
  useInjectReducer({ key: "landingPage", reducer });
  useInjectSaga({ key: "landingPage", saga });

  return (
    <div>
      <Helmet>
        <title>LandingPage</title>
        <meta name="description" content="Description of LandingPage" />
      </Helmet>
      <Input id="sdv" />

      <FormattedMessage {...messages.header} />
    </div>
  );
}

LandingPage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  landingPage: makeSelectLandingPage()
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

export default compose(withConnect)(LandingPage);
