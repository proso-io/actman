import styled from "styled-components";

const LoginFormCard = styled.div`
  width: 30%;
  margin: auto;
  padding: ${props => props.theme.spacing.twentyfour};
  background: ${props => props.theme.black80};

  @media only screen and (max-width: 560px) {
    width: 90%;
  }
`;

export default LoginFormCard;
