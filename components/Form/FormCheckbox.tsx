import { useEffect, useState } from 'react';
import styled from 'styled-components';
import FormItem from './FormItem';
import { useAppDispatch } from 'utils/store';
import { updateData } from 'reducers/formSlice';

const Input = styled.label<{ checked: boolean }>`
  height: 20px;
  width: 20px;
  border: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  border-radius: 3px;
  cursor: pointer;
  margin: 0 10px;

  &:after {
    display: block;
    position: relative;
    content: '';
    transition: all 0.1s;
    left: ${({ checked }) => (checked ? '2px' : '7px')};
    top: ${({ checked }) => (checked ? '2px' : '7px')};
    height: ${({ checked }) => (checked ? '14px' : 0)};
    width: ${({ checked }) => (checked ? '14px' : 0)};
    background: ${({ theme }) => theme.colors.lightpurple};
  }
`;

interface FormCheckbox {
  name: string;
  title?: string;
  checked?: boolean;
}

const FormCheckbox: React.FC<FormCheckbox> = ({ name, title, checked }) => {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(checked || false);

  useEffect(() => {
    dispatch(updateData({ field: name, value: active }));
  }, [active]);

  return (
    <FormItem
      name={name}
      title={title}
      onClick={() => setActive(!active)}
      inline
    >
      <Input
        checked={active}
        tabIndex={0}
        onClick={() => setActive(!active)}
        onKeyPress={(e) =>
          (e.key === ' ' || e.key === 'Enter') && setActive(!active)
        }
      />
    </FormItem>
  );
};

export default FormCheckbox;
