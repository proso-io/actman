/**
 *
 * EditSchemaPage
 *
 */

import React, { useEffect } from "react";
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
import {
  saveSchemaAction,
  getSchemaAction,
  updateSchemaSaveState
} from "./actions";
import { push } from "connected-react-router";
import { SCHEMA_UNSAVED_STATE } from "./constants";

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

  useEffect(() => {
    if (schemaId) {
      if (!props.editSchemaPage.getSchemaState) {
        props.getSchema(schemaId);
      }
    }
  });

  if (newSchema && props.editSchemaPage.schemaData) {
    let id = props.editSchemaPage.schemaData._id;
    if (id) {
      props.push(`/forms/${id}`);
    }
  }

  const schema = newSchema ? null : props.editSchemaPage.schemaData.schema;

  return (
    <div>
      <Helmet>
        <title>Create a new form</title>
        <meta
          name="description"
          content="New forms for programs are created on this page"
        />
      </Helmet>
      {(newSchema || (schemaId && schema)) && (
        <StyledFormBuilder
          builderMode={true}
          onSchemaSubmit={schema => props.saveSchema(schema, schemaId)}
          saveFormSchemaState={
            props.editSchemaPage.schemaSaveState || SCHEMA_UNSAVED_STATE
          }
          formTitle={newSchema ? "" : props.editSchemaPage.schemaData.title}
          formSchema={schema}
          onFormSchemaChange={props.updateSchemaSaveState}
        />
      )}
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
    saveSchema: (schema, id) => dispatch(saveSchemaAction(schema, id)),
    getSchema: id => dispatch(getSchemaAction(id)),
    push: payload => dispatch(push(payload)),
    updateSchemaSaveState: () =>
      dispatch(updateSchemaSaveState(SCHEMA_UNSAVED_STATE))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(EditSchemaPage);
