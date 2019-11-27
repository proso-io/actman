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
  makeSelectProgramsRequestState,
  makeSelectActivity,
  makeSelectActivityRequestState
} from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";
import { programsRequestAction, activityRequestAction } from "./actions";
import {
  PROGRAMS_NOT_FETCHED,
  ACTIVITY_NOT_FETCHED,
  GET_ACTIVITY_ENDPOINT
} from "./constants";

import {
  formsRequestAction,
  uploadFormDataRequestAction
} from "containers/App/actions";
import { makeSelectFormByProgramId } from "containers/App/selectors";
import FlexContainer from "../../components/FlexContainer";
import Text from "../../components/Text";
import Spacing from "../../components/Spacing";
import { makeSelectForms, makeSelectOrgId } from "../App/selectors";
import ListItem from "../../components/ListItem";

import { FormBuilder } from "@proso-io/fobu/dist/components";

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
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
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

  const activityId = props.match.params.activityId;

  console.log("activityId: ", activityId);

  const selectedForm = activityId
    ? props.activity && {
        schema: props.activity.schema,
        title: props.activity.name
      }
    : selectedProgram
    ? getFormByProgramId(forms, selectedProgram.sid)
    : activityId
    ? { title: null }
    : null;

  useEffect(() => {
    if (activityId) {
      if (props.activityRequestState === ACTIVITY_NOT_FETCHED) {
        props.fetchActivity(activityId);
      }
    } else if (props.programsRequestState === PROGRAMS_NOT_FETCHED) {
      props.onComponentLoaded();
    }
  });

  let submitUrl = GET_ACTIVITY_ENDPOINT;
  if (activityId) {
    submitUrl += "/" + activityId;
  }

  let submitMethod = activityId ? "PUT" : "POST";

  return (
    <div>
      <Helmet>
        <title>{activityId ? "Edit" : "Record"} Activity</title>
        <meta name="description" content="Description of RecordActivity" />
      </Helmet>
      <PageContainer>
        {!activityId &&
          (selectedProgram ? (
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
          ))}
        {selectedForm &&
        (!activityId || (activityId && props.activity.mdata)) ? (
          <StyledFormBuilder
            formTitle={selectedForm.title}
            builderMode={false}
            formSchema={selectedForm.schema}
            formData={activityId ? props.activity.mdata : {}}
            onDataSubmit={(formData, formSchema) => {
              let mergeObj = {
                name: selectedForm.title,
                pid: activityId ? props.activity.pid : selectedProgram._id,
                oid: props.orgId
              };
              toast.success(
                "Form upload started. You will be notified once activity is uploaded."
              );
              setTimeout(function() {
                props.uploadFormData({
                  formData,
                  formSchema,
                  mergeObj,
                  submitUrl: submitUrl,
                  submitMethod: submitMethod, // submitMethod,
                  mediaUploadUrl: "/api/media"
                  //serviceWorkerUrl: "/form-sw.js"
                });
              });
              props.push("/");
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
  uploadFormData: PropTypes.func.isRequired,
  onComponentLoaded: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  forms: makeSelectForms(),
  programs: makeSelectPrograms(),
  programsRequestState: makeSelectProgramsRequestState(),
  orgId: makeSelectOrgId(),
  activity: makeSelectActivity(),
  activityRequestState: makeSelectActivityRequestState()
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentLoaded: () => {
      dispatch(programsRequestAction());
      dispatch(formsRequestAction());
    },
    uploadFormData: data => dispatch(uploadFormDataRequestAction(data)),
    push: payload => dispatch(push(payload)),
    fetchActivity: id => dispatch(activityRequestAction(id))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(RecordActivity);
