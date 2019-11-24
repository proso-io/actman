/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import messages from "./messages";
import styled from "styled-components";

import FormDataService from "../../services/FormDataService";

import { FormBuilder } from "@proso-io/fobu/dist/components";
import { formDataUploader } from "@proso-io/fobu/dist/uploadUtils";

const StyledFormBuilder = styled(FormBuilder)`
  width: 95% !important;
  margin: 0 !important;
  padding: 0 !important;
  margin-top: ${props => props.theme.spacing.twelve} !important;
`;

export default function HomePage() {
  const [hasPending, setHasPending] = useState(false);
  FormDataService.hasPendingUploads().then(pendingFormRequest => {
    if (pendingFormRequest && pendingFormRequest.length > 0) {
      setHasPending(true);
    }
  });
  return (
    <>
      <pre>
        {hasPending
          ? "Has pending form upload request."
          : "No pending requests."}
      </pre>
    </>
  );
}
