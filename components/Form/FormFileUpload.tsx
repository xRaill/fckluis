import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FormItem from './FormItem';
import FormButton from './FormButton';
import { useAppDispatch } from 'utils/store';
import { updateData } from 'reducers/formSlice';

export const FileInput = styled.label<{ active: boolean }>`
  display: flex;
  align-items: stretch;
  button:first-child {
    border-radius: 10px 0 0 10px;
  }
  button:last-child {
    border-radius: 0 10px 10px 0;
  }
  & > span {
    display: flex;
    margin: 10px 0;
    padding: 5px;
    width: 100%;
    align-items: center;
    border: ${({ theme }) => `1px solid ${theme.colors.purple}`};
    border-radius: ${({ active }) => !active && '0 10px 10px 0'};
  }
`;

interface FormFileUpload {
  name: string;
  accept?: string;
  value?: string;
}

const FormFileUpload: React.FC<FormFileUpload> = ({ name, accept, value }) => {
  const [fileName, setFileName] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>();
  const dispatch = useAppDispatch();

  const handleFileChange = async (file: File = null) => {
    if (file?.type && accept?.split(',').includes(file?.type)) {
      dispatch(
        updateData({ field: name, value: window.URL.createObjectURL(file) })
      );
      dispatch(updateData({ field: name + 'Name', value: file.name }));
      setFileName(file.name);
    } else {
      setFileName(undefined);
      dispatch(updateData({ field: name, value: '' }));
      dispatch(updateData({ field: name + 'Name', value: '' }));
    }
  };

  useEffect(() => {
    if (value) dispatch(updateData({ field: name, value }));
  }, []);

  return (
    <FormItem name={name}>
      <input
        type={'file'}
        id={'file-input'}
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => handleFileChange(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <FileInput htmlFor={'file-input'} active={!!fileName}>
        <FormButton onClick={() => fileInputRef.current.click()}>
          {fileName ? 'Change' : 'Add'}
        </FormButton>
        <span>{fileName || 'No file selected'}</span>
        {fileName && (
          <FormButton color={'red'} onClick={() => handleFileChange()}>
            Remove
          </FormButton>
        )}
      </FileInput>
    </FormItem>
  );
};

export default FormFileUpload;
