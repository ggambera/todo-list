import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 0.3rem;
`;

function TextInputWithLabel({
  elementId,
  label,
  onChange,
  ref,
  value,
}) {

  return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <StyledInput type="text"
        id={elementId}
        ref={ref}
        name="title"
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel