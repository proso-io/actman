import styled from "styled-components";

const StaticNav = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  background: ${props => props.theme.black60};
  color: ${props => props.theme.white};
  padding: 0 ${props => props.theme.spacing.twentyfour};
`;

export default StaticNav;
