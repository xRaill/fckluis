import styled from 'styled-components';
import FormError from './FormError';

const InputItem = styled.div<{ inline: boolean; hidden: boolean }>`
  display: ${({ hidden, inline }) =>
    hidden ? 'none' : inline ? 'flex' : 'block'};
  align-items: center;
  margin: 15px auto;
  width: 90vw;
  text-align: left;
  @media (min-width: 767px) {
    width: 40vw;
  }
  /* & button {
    margin: 0 auto;
  } */
`;

const Label = styled.label<{ inline?: boolean }>`
  display: block;
  width: ${({ inline }) => !inline && '100%'};
  padding: 5px 10px;
  text-align: left;
  color: ${({ theme }) => theme.colors.purple};
`;

interface FormItem {
  name?: string;
  inline?: boolean;
  hidden?: boolean;
}

const FormItem: React.FC<FormItem> = ({ name, inline, hidden, children }) => (
  <InputItem {...{ inline, hidden }}>
    {!hidden && name && (
      <Label htmlFor={name} inline={inline}>
        {name[0].toUpperCase() + name.slice(1)}
      </Label>
    )}
    {children}
    {name && <FormError field={name} />}
  </InputItem>
);

export default FormItem;
