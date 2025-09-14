import styled from 'styled-components';

const MaxWidthContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-left: auto;
  margin-right: auto;
`;

export default MaxWidthContainer;
