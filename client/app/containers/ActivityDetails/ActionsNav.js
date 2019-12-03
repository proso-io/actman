import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Text from "components/Text";
import Button from "components/Button";
import FlexContainer from "../../components/FlexContainer";
import Spacing from "../../components/Spacing";
import { Input } from "@proso-io/fobu/dist/components";

const ActionsBar = styled.div`
  position: sticky;
  width: 100%;
  margin-left: -${props => props.theme.spacing.twentyfour};
  padding: ${props => props.theme.spacing.twentyfour};
  border-bottom: 1px solid ${props => props.theme.primary80};
`;

const ProjectInput = styled(Input)`
  margin-bottom: 0 !important;

  & label.input__label {
    margin-bottom: 0;
  }

  & input.input {
    height: 40px;
  }
`;

function ActionsNav({ addonsData, hasRight, updateAddon, activityId, perms }) {
  const [projectName, setProjectName] = useState(
    addonsData ? addonsData["project"] || "" : ""
  );

  const entity = "Activities";

  return (
    <ActionsBar>
      <FlexContainer mainAxis="space-between">
        <div style={{ width: "50%" }}>
          <FlexContainer mainAxis="flex-start">
            {hasRight(entity, "update-verified", perms) && (
              <Button
                themeType="primary"
                disabled={addonsData && addonsData["is-verified"]}
                onClick={() =>
                  updateAddon(entity, activityId, "is-activity-verified", {
                    status: true
                  })
                }
              >
                {addonsData && addonsData["is-verified"]
                  ? "Marked as verified"
                  : "Mark as verified"}
              </Button>
            )}

            <Spacing type="horizontal" spacing="sixteen" />

            {hasRight(entity, "update-special", perms) && (
              <Button
                themeType="secondary"
                disabled={addonsData && addonsData["is-special"]}
                onClick={() =>
                  updateAddon(entity, activityId, "is-activity-special", {
                    status: true
                  })
                }
              >
                {addonsData && addonsData["is-special"]
                  ? "Marked as special"
                  : "Mark as special"}
              </Button>
            )}

            <Spacing type="horizontal" spacing="sixteen" />

            {hasRight(entity, "update-approved", perms) && (
              <Button
                themeType="secondary"
                disabled={addonsData && addonsData["is-approved"]}
                onClick={() =>
                  updateAddon(entity, activityId, "is-activity-approved", {
                    status: true
                  })
                }
              >
                {addonsData && addonsData["is-approved"]
                  ? "Marked as approved"
                  : "Mark as approved"}
              </Button>
            )}
          </FlexContainer>
        </div>

        {hasRight(entity, "update-project", perms) && (
          <div className="fobuComponents" style={{ width: "50%" }}>
            <FlexContainer mainAxis="flex-end">
              <ProjectInput
                id="project-name"
                placeholder="Eg. Google"
                value={projectName}
                onValueChange={(id, value) => setProjectName(value)}
              />
              <Spacing type="horizontal" spacing="eight" />
              <Button
                themeType="secondary"
                onClick={() => {
                  updateAddon(entity, activityId, "project", {
                    project: projectName
                  });
                }}
              >
                Add project
              </Button>
            </FlexContainer>
          </div>
        )}
      </FlexContainer>
    </ActionsBar>
  );
}

export default ActionsNav;
