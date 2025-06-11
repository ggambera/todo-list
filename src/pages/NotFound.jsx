import styled from 'styled-components';
import { Link } from 'react-router';

const StyledDiv = styled.div`
display: inline;
text-align: center;
`;

function NotFound({ }) {

  return (
    <>
      <StyledDiv>
        <h2>Page Not Found</h2>
        <Link to={'/'}>
          Go back home
        </Link>
      </StyledDiv>
    </>
  )
}

export default NotFound