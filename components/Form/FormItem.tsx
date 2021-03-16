import styled from 'styled-components';
import FormError from './FormError';

const InputItem = styled.div`
  width: 40vw;
  margin: 15px auto;
`;

const Label = styled.label`
  display: block;
  width: 100%;
  padding: 5px 10px;
  text-align: left;
  color: ${({ theme }) => theme.colors.purple};
`;

interface FormItem {
  name: string;
}

const FormItem: React.FC<FormItem> = ({ name, children }) => (
  <InputItem>
    <Label htmlFor={name}>{name[0].toUpperCase() + name.slice(1)}</Label>
    {children}
    <FormError field={name} />
  </InputItem>
);

export default FormItem;
