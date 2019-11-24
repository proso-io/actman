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
