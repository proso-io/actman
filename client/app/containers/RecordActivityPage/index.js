/**
 *
 * RecordActivity
 *
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { push } from "connected-react-router";
import styled from "styled-components";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { toast } from "react-toastify";

import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import {
  makeSelectPrograms,
  makeSelectProgramsRequestState
} from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";
import { programsRequestAction } from "./actions";
import { PROGRAMS_NOT_FETCHED } from "./constants";

import { formsRequestAction } from "containers/App/actions";
import { makeSelectFormByProgramId } from "containers/App/selectors";
import FlexContainer from "../../components/FlexContainer";
import Text from "../../components/Text";
import Spacing from "../../components/Spacing";
import { makeSelectForms } from "../App/selectors";
import ListItem from "../../components/ListItem";

import { FormBuilder } from "@proso-io/fobu/dist/components";
import { formDataUploader } from "@proso-io/fobu/dist/uploadUtils";

const PageContainer = styled.div`
  padding-top: ${props => props.theme.spacing.thirtysix};
`;

const ProgramsGrid = styled.div`
  width: 80%;
  display: ${props => (props.show ? "block" : "none")};
`;

const ProgramCard = styled.div`
  height: 200px;
  width: 20%;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.theme.primary80};
  margin-right: ${props => props.theme.spacing.twelve};
  cursor: pointer;
`;

const ProgramHeader = styled.div`
  height: 150px;
  background: ${props => props.theme.primary60};
`;

const ProgramBody = styled.div`
  height: 50px;
`;

const StyledFormBuilder = styled(FormBuilder)`
  width: 95% !important;
  margin: 0 !important;
  padding: 0 !important;
  margin-top: ${props => props.theme.spacing.twelve} !important;
  margin-bottom: ${props => props.theme.spacing.twentyfour} !important;
`;

function getFormByProgramId(forms, schemaId) {
  return forms.find(form => form._id === schemaId);
}

export function RecordActivity(props) {
  useInjectReducer({ key: "recordActivity", reducer });
  useInjectSaga({ key: "recordActivity", saga });

  const { forms, programs } = props;

  const [showPrograms, setShowPrograms] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const selectedForm = selectedProgram
    ? getFormByProgramId(forms, selectedProgram.sid)
    : null;

  useEffect(() => {
    if (props.programsRequestState === PROGRAMS_NOT_FETCHED) {
      props.onComponentLoaded();
    }
  });

  return (
    <div>
      <Helmet>
        <title>Record Activity</title>
        <meta name="description" content="Description of RecordActivity" />
      </Helmet>
      <PageContainer>
        {selectedProgram ? (
          <div>
            <Text type="caption" weight="semibold">
              Chosen program:
            </Text>
            <ListItem>
              <FlexContainer mainAxis="space-between">
                <Text type="body" weight="semibold">
                  {selectedProgram.name}
                </Text>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setSelectedProgram(null);
                  }}
                >
                  Edit
                </a>
              </FlexContainer>
            </ListItem>
          </div>
        ) : (
          <ProgramsGrid show={showPrograms}>
            <Text type="caption" weight="semibold">
              Choose a program:
            </Text>
            <Spacing spacing="sixteen" />
            <FlexContainer
              mainAxis="flex-start"
              crossAxis="flex-start"
              wrap="wrap"
            >
              {programs.map(program => {
                return (
                  <ProgramCard
                    key={program._id}
                    onClick={() => setSelectedProgram(program)}
                  >
                    <ProgramHeader>
                      <FlexContainer height="100%">
                        <Text type="subtitle">{program.name}</Text>
                      </FlexContainer>
                    </ProgramHeader>

                    <ProgramBody>
                      <FlexContainer height="100%">
                        <Text type="body">{program.desc}</Text>
                      </FlexContainer>
                    </ProgramBody>
                  </ProgramCard>
                );
              })}
            </FlexContainer>
          </ProgramsGrid>
        )}
        {selectedForm ? (
          <StyledFormBuilder
            formTitle={selectedForm.title}
            builderMode={false}
            formSchema={selectedForm.schema}
            onDataSubmit={(formData, formSchema) => {
              let mergeObj = {
                name: "",
                pid: selectedProgram._id
              };

              formDataUploader(
                formData,
                formSchema,
                mergeObj,
                "/api/activities",
                "POST",
                "/api/media",
                "/form-sw.js"
              );
              toast.success(
                "Form upload started. You will be notified once activity is uploaded."
              );
              setTimeout(function() {
                props.push("/");
              });
            }}
          />
        ) : (
          ""
        )}
      </PageContainer>
    </div>
  );
}

RecordActivity.propTypes = {
  forms: PropTypes.array,
  programs: PropTypes.array,
  programsRequestState: PropTypes.number,
  onComponentLoaded: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  forms: makeSelectForms(),
  programs: makeSelectPrograms(),
  programsRequestState: makeSelectProgramsRequestState()
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentLoaded: () => {
      dispatch(programsRequestAction());
      dispatch(formsRequestAction());
    },
    push: payload => dispatch(push(payload))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(RecordActivity);
