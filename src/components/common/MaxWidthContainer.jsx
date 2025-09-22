import styled from 'styled-components';

const MaxWidthContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-left: auto;
  margin-right: auto;
  padding: 0 15px;

  & > .full-width {
    margin-left: -15px;
    margin-right: -15px;
  }
`;

export default MaxWidthContainer;
