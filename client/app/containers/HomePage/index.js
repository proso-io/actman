/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import messages from "./messages";
import styled from "styled-components";

import { FormBuilder } from "@proso-io/fobu/dist/components";
import { formDataUploader } from "@proso-io/fobu/dist/uploadUtils";

const StyledFormBuilder = styled(FormBuilder)`
  width: 95% !important;
  margin: 0 !important;
  padding: 0 !important;
  margin-top: ${props => props.theme.spacing.twelve} !important;
`;

export default function HomePage() {
  return (
    <>
      <StyledFormBuilder
        saveFormSchemaState="saved"
        onDataSubmit={(formData, formSchema) =>
          formDataUploader(
            "/api/media",
            formData,
            formSchema
            //"/form-sw.js"
          )
        }
      />
    </>
  );
}
