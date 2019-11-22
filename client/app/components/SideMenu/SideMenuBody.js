import styled from "styled-components";
import Text from "../Text";

export const SideMenuBody = styled.div`
  width: 100%;
  overflow-y: scroll;
  padding-top: ${props => props.theme.spacing.sixteen};
`;

export const MenuTitleText = styled(Text)`
  padding: ${props => props.theme.spacing.twelve};
`;

export const MenuContainer = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const MenuItemContainer = styled.li`
  padding: ${props => props.theme.spacing.twelve};
  background: ${props =>
    props.isActive ? props.theme.primary : "transparent"};
  width: 100%;
  cursor: pointer;
`;
