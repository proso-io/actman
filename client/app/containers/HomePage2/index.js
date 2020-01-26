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
import ActivityTile from "components/ActivityTile";
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
      <ActivityTile
        programName="CFW"
        location="Bihar"
        startDate="12-08-2019"
        endDate="14-08-2019"
        commentsCount={8}
        imageUrls={[
          "https://images.unsplash.com/photo-1574441170839-b40201becb6b"
        ]}
      />
    </>
  );
}
