import styled from "styled-components";

export const SideMenuFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${props => props.theme.spacing.twelve};
  border-top: 1px solid ${props => props.theme.primary80};
  text-align: center;
  cursor: pointer;
`;
