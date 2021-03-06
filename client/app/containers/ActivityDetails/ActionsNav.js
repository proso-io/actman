import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Text from "components/Text";
import Button from "components/Button";
import FlexContainer from "../../components/FlexContainer";
import Spacing from "../../components/Spacing";
import { Input } from "@proso-io/fobu/dist/components";
import { UPDATING_ADDON } from "./constants";

const ActionsBar = styled.div`
  position: sticky;
  width: 100%;
  margin-left: -${props => props.theme.spacing.twentyfour};
  padding: ${props => props.theme.spacing.twentyfour};
  padding-right: 0;
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

function ActionsNav({
  addonsData,
  hasRight,
  updateAddon,
  activityId,
  perms,
  addonState,
  updateAddonType,
  isFetchingActivity
}) {
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    if (!isFetchingActivity && addonsData && addonsData["project"]) {
      setProjectName(addonsData["project"]);
    }
  });

  const isLoading = addonState === UPDATING_ADDON;

  const entity = "Activities";

  return (
    <ActionsBar>
      <FlexContainer width="100%" mainAxis="flex-start" wrap="wrap">
        {hasRight(entity, "update-verified", perms) && (
          <Button
            themeType="primary"
            disabled={addonsData && addonsData["is-verified"]}
            loading={isLoading && updateAddonType === "is-activity-verified"}
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

        {hasRight(entity, "update-special", perms) && (
          <div>
            <Spacing type="horizontal" spacing="sixteen" />
            <Button
              themeType="secondary"
              disabled={addonsData && addonsData["is-special"]}
              loading={isLoading && updateAddonType === "is-activity-special"}
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
          </div>
        )}

        {hasRight(entity, "update-approved", perms) && (
          <div>
            <Spacing type="horizontal" spacing="sixteen" />
            <Button
              themeType="secondary"
              disabled={addonsData && addonsData["is-approved"]}
              loading={isLoading && updateAddonType === "is-activity-approved"}
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
          </div>
        )}
      </FlexContainer>

      <div>
        <Spacing type="vertical" spacing="twentyfour" />
        {hasRight(entity, "update-project", perms) && (
          <div className="fobuComponents">
            <FlexContainer mainAxis="flex-start">
              <ProjectInput
                id="project-name"
                placeholder="Eg. Google"
                value={projectName}
                onValueChange={(id, value) => setProjectName(value)}
              />
              <Spacing type="horizontal" spacing="eight" />
              <Button
                themeType="secondary"
                loading={isLoading && updateAddonType === "project"}
                onClick={() => {
                  updateAddon(entity, activityId, "project", {
                    project: projectName
                  });
                }}
              >
                {addonsData && addonsData["project"] ? "Added" : "Add project"}
              </Button>
            </FlexContainer>
          </div>
        )}
      </div>
    </ActionsBar>
  );
}

export default ActionsNav;
