/**
 *
 * EditSchemaPage
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
import makeSelectEditSchemaPage from "./selectors";
import { makeSelectLocation } from "containers/App/selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";

import { FormBuilder } from "@proso-io/fobu/dist/components";
import styled from "styled-components";
import { saveSchemaAction } from "./actions";
import {
  DEFAULT_ACTION,
  SCHEMA_SAVED_STATE,
  SCHEMA_UNSAVED_STATE,
  SCHEMA_SAVING_STATE,
  SCHEMA_UPLOAD_ENDPOINT,
  SCHEMA_SAVE_REQUEST_ACTION,
  SCHEMA_SAVE_RESPONSE_ACTION,
  SCHEMA_SAVE_SUCCEEDED,
  SCHEMA_SAVE_FAILED
} from "./constants";

const StyledFormBuilder = styled(FormBuilder)`
  width: 95% !important;
  margin: 0 !important;
  padding: 0 !important;
  margin-top: ${props => props.theme.spacing.twelve} !important;
`;

export function EditSchemaPage(props) {
  useInjectReducer({ key: "editSchemaPage", reducer });
  useInjectSaga({ key: "editSchemaPage", saga });

  const newSchema = props.match.params.schema === "new";

  const schemaId = newSchema ? null : props.match.params.schema;

  console.log("EditSchemaPage", props.editSchemaPage.schemaSaveState);

  return (
    <div>
      <Helmet>
        <title>EditSchemaPage</title>
        <meta name="description" content="Description of EditSchemaPage" />
      </Helmet>
      <StyledFormBuilder
        builderMode={true}
        onSchemaSubmit={schema => props.saveSchema(schema)}
        saveFormSchemaState={
          props.editSchemaPage.schemaSaveState || SCHEMA_SAVED_STATE
        }
      />
    </div>
  );
}

EditSchemaPage.propTypes = {
  saveSchema: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  editSchemaPage: makeSelectEditSchemaPage()
});

function mapDispatchToProps(dispatch) {
  return {
    saveSchema: schema => dispatch(saveSchemaAction(schema))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(EditSchemaPage);
