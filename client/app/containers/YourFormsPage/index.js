/**
 *
 * YourFormsPage
 *
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";

import {
  makeSelectForms,
  makeSelectFormsRequestState
} from "containers/App/selectors";
import { formsRequestAction } from "containers/App/actions";
import reducer from "containers/App/reducer";
import saga from "containers/App/saga";
import messages from "./messages";
import { FORMS_NOT_FETCHED } from "./constants";

import Text from "components/Text";
import Button from "components/Button";
import FlexContainer from "components/FlexContainer";
import ListItem from "../../components/ListItem";

const SchemaListContainer = styled.div`
  margin-top: ${props => props.theme.spacing.thirtysix};
`;

const PageContainer = styled.div`
  padding-top: ${props => props.theme.spacing.thirtysix};
`;

export function YourFormsPage(props) {
  useInjectReducer({ key: "yourFormsPage", reducer });
  useInjectSaga({ key: "yourFormsPage", saga });

  useEffect(() => {
    if (props.formsRequestState === FORMS_NOT_FETCHED) {
      props.onComponentLoaded();
    }
  });

  return (
    <div>
      <Helmet>
        <title>Your forms</title>
        <meta
          name="description"
          content="Forms uploaded by the organisation will appear here"
        />
      </Helmet>

      <PageContainer>
        <Button
          type="primary"
          text="Create new form"
          onClick={e => {
            e.preventDefault();
            props.push(`/schemas/new`);
          }}
        />
        <SchemaListContainer>
          <Text type="caption">Saved forms</Text>
          {props.forms.map(form => {
            return (
              <ListItem key={form._id}>
                <FlexContainer mainAxis="space-between">
                  <Text type="body" weight="semibold">
                    {form.title}
                  </Text>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      props.push(`/schemas/${form._id}`);
                    }}
                  >
                    Edit
                  </a>
                </FlexContainer>
              </ListItem>
            );
          })}
        </SchemaListContainer>
      </PageContainer>
    </div>
  );
}

YourFormsPage.propTypes = {
  forms: PropTypes.array,
  formsRequestState: PropTypes.number,
  onComponentLoaded: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  forms: makeSelectForms(),
  formsRequestState: makeSelectFormsRequestState()
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentLoaded: () => dispatch(formsRequestAction()),
    push: payload => dispatch(push(payload))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(YourFormsPage);
