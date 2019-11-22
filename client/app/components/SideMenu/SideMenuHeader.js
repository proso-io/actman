import styled from "styled-components";

export const SideMenuHeader = styled.div`
  width: 100%;
  height: 80px;
  padding: ${props => props.theme.spacing.sixteen}
    ${props => props.theme.spacing.twelve};
  position: relative;
  background: ${props => props.theme.white};
  border-bottom: ${props => props.theme.primary80};
`;

export const CaretDownContainer = styled.div`
  color: ${props => props.theme.primary40};
  width: 10%;
  text-align: left;
`;

export const UserInfoContainer = styled.div`
  width: 80%;
`;

export const UserInfoTextContainer = styled.div`
  margin-left: ${props => props.theme.spacing.eight};
`;

export const CrossContainer = styled.div`
  color: ${props => props.theme.primary40};
  width: 10%;
  text-align: right;
`;
