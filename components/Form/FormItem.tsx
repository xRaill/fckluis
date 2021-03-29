import styled from 'styled-components';
import FormError from './FormError';

const InputItem = styled.div<{ inline?: boolean }>`
  display: ${({ inline }) => (inline ? 'flex' : 'block')};
  align-items: center;
  margin: 15px auto;
  width: 90vw;
  text-align: left;
  @media (min-width: 767px) {
    width: 40vw;
  }
`;

const Label = styled.label<{ inline?: boolean }>`
  display: block;
  width: ${({ inline }) => !inline && '100%'};
  padding: 5px 10px;
  text-align: left;
  color: ${({ theme }) => theme.colors.purple};
`;

interface FormItem {
  name: string;
  inline?: boolean;
}

const FormItem: React.FC<FormItem> = ({ name, inline, children }) => (
  <InputItem inline={inline}>
    <Label htmlFor={name} inline={inline}>
      {name[0].toUpperCase() + name.slice(1)}
    </Label>
    {children}
    <FormError field={name} />
  </InputItem>
);

export default FormItem;
