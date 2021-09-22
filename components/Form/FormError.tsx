import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from 'utils/store';

export const Error = styled.div<{ active: boolean }>`
  transition: color 0.5s, height 0.5s;
  height: 0;
  color: transparent;
  text-align: center;
  ${({ active }) =>
    active && {
      color: 'red',
      height: '1em',
    }};
`;

interface FormError {
  field: string;
}

const FormError: React.FC<FormError> = ({ field }) => {
  const [message, setMessage] = useState('');
  const { errors } = useAppSelector((state) => state.form);

  useEffect(() => {
    const error = errors.find((a) => a.field === field);
    if (error) setMessage(error.message);
    else setMessage('');
  }, [errors]);

  return <Error active={!!message}>{message}</Error>;
};

export default FormError;
