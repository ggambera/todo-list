import styled from 'styled-components';

const StyledDiv = styled.div`
display: inline;
text-align: center;
`;

function About({ }) {

  return (
    <>
      <StyledDiv>
        <h2>Todo List App</h2>
        <p>Version: 0.1.0</p>
        <p>Updated: 05/03/2025</p>
        <p>Author: German Gambera</p>
        <p>Built for: Code The Dream</p>
      </StyledDiv>
    </>
  )
}

export default About