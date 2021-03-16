import { useEffect } from 'react';
import styled from 'styled-components';
import FormItem from './FormItem';
import { useAppDispatch } from 'utils/store';
import { start, updateData } from 'reducers/formSlice';

const Input = styled.input`
  outline: none;
  border: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  border-radius: 10px;
  font-size: 1em;
  width: 100%;
  padding: 7px 10px;
`;

interface FormInput {
  name: string;
  type?: string;
  placeholder?: string;
}

const FormField: React.FC<FormInput> = ({ name, type, placeholder }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateData({ field: name, value: '' }));
  }, []);

  return (
    <FormItem name={name}>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        onChange={(e) =>
          dispatch(updateData({ field: name, value: e.currentTarget.value }))
        }
        onKeyPress={(e) => e.key == 'Enter' && dispatch(start())}
      />
    </FormItem>
  );
};

export default FormField;
