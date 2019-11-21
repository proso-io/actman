import styled from "styled-components";
import bgImage from "../../images/loginbg.png";

const BackgroundContainer = styled.div`
  height: 100vh;
  width: 100%;
  opacity: 0.8;
  background: url(${bgImage});
  background-position: top;
  background-repeat-x: no-repeat;
  background-size: cover;
`;

export default BackgroundContainer;
