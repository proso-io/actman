import styled from "styled-components";

const SideMenuHeader = styled.div`
  width: 100%;
  height: 80px;
  padding: ${props => props.theme.spacing.sixteen}
    ${props => props.theme.spacing.twelve};
  position: relative;
  background: ${props => props.theme.white};
  border-bottom: ${props => props.theme.primary80};
`;

export default SideMenuHeader;
