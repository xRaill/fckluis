import { useEffect } from 'react';
import styled from 'styled-components';
import FormItem from './FormItem';
import { useAppDispatch } from 'utils/store';
import { updateData } from 'reducers/formSlice';

const Input = styled.textarea`
  outline: none;
  border: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  border-radius: 10px;
  font-size: 1em;
  width: 100%;
  resize: vertical;
  min-height: 100px;
  padding: 7px 10px;
  font-family: inherit;
`;

interface FormArea {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

const FormArea: React.FC<FormArea> = ({ name, defaultValue, placeholder }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateData({ field: name, value: defaultValue || '' }));
  }, []);

  return (
    <FormItem name={name}>
      <Input
        id={name}
        {...{ name, defaultValue, placeholder }}
        onChange={(e) =>
          dispatch(updateData({ field: name, value: e.currentTarget.value }))
        }
      />
    </FormItem>
  );
};

export default FormArea;
