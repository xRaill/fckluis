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
  value?: string | number;
  defaultValue?: string;
  placeholder?: string;
}

const FormField: React.FC<FormInput> = ({
  name,
  type,
  defaultValue,
  value,
  placeholder,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateData({ field: name, value }));
  }, [value]);

  useEffect(() => {
    dispatch(updateData({ field: name, value: defaultValue }));
  }, []);

  return (
    <FormItem name={name} hidden={type === 'hidden'}>
      <Input
        id={name}
        {...{ name, type, defaultValue, value, placeholder }}
        onChange={(e) =>
          dispatch(updateData({ field: name, value: e.currentTarget.value }))
        }
        onKeyPress={(e) => e.key == 'Enter' && dispatch(start())}
      />
    </FormItem>
  );
};

export default FormField;
