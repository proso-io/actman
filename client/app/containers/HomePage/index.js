/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import messages from "./messages";

import { FormBuilder } from "@proso-io/fobu/dist/components";
import { formDataUploader } from "@proso-io/fobu/dist/uploadUtils";

export default function HomePage() {
  return (
    <>
      <FormBuilder
        onSubmit={(formData, formSchema) =>
          formDataUploader(
            "https://www.mocky.io/v2/5c0452da3300005100d01d1f",
            formData,
            formSchema,
            "/form-sw.js"
          )
        }
      />
    </>
  );
}
