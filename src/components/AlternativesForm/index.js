import styled from 'styled-components';

const AlternativesForm = styled.form`
  label {
    &[data-selected="true"] {
      background-color: ${({ theme }) => theme.colors.primary};
      font-weight: 600;
      
      &[data-status="SUCCESS"] {
        background-color: ${({ theme }) => theme.colors.success};
        color: white;
      }
      &[data-status="ERROR"] {
        background-color: ${({ theme }) => theme.colors.wrong};
        color: white;
      }
    }
    &:focus {
      opacity: 1;
    } 
    &:hover {
      margin-left: 3px;
    }
  }
  button {
    margin-top: 24px;
  }
`;

export default AlternativesForm;