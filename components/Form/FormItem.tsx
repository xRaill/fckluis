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
  title?: string;
  inline?: boolean;
  hidden?: boolean;
  onClick?: VoidFunction;
}

const FormItem: React.FC<FormItem> = ({
  name,
  title,
  inline,
  hidden,
  onClick,
  children,
}) => (
  <InputItem {...{ inline, hidden }} onClick={onClick}>
    {!hidden && name && (
      <Label htmlFor={name} inline={inline}>
        {(title || name)[0].toUpperCase() + (title || name).slice(1)}
      </Label>
    )}
    {children}
    {name && <FormError field={name} />}
  </InputItem>
);

export default FormItem;
