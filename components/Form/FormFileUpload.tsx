import { useRef, useState } from 'react';
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
  const [file, setFile] = useState<File>(value && new File([], value));
  const fileInputRef = useRef<HTMLInputElement>();
  const dispatch = useAppDispatch();

  const handleFileChange = async (file: File = null) => {
    if (file?.type && accept?.split(',').includes(file?.type)) {
      setFile(file);
      dispatch(
        updateData({
          field: name,
          value: Buffer.from(await file.arrayBuffer()),
        })
      );
      dispatch(
        updateData({
          field: name + '_name',
          value: file.name,
        })
      );
    } else {
      setFile(undefined);
      dispatch(
        updateData({
          field: name,
          value: '',
        })
      );
      dispatch(
        updateData({
          field: name + '_name',
          value: '',
        })
      );
    }
  };

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
      <FileInput htmlFor={'file-input'} active={!!file}>
        <FormButton onClick={() => fileInputRef.current.click()}>
          {file ? 'Change' : 'Add'}
        </FormButton>
        <span>{file?.name || 'No file selected'}</span>
        {file && (
          <FormButton color={'red'} onClick={() => handleFileChange()}>
            Remove
          </FormButton>
        )}
      </FileInput>
    </FormItem>
  );
};

export default FormFileUpload;
