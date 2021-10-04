import { useEffect } from 'react';
import FormItem from './FormItem';
import { useAppDispatch } from 'utils/store';
import { updateData } from 'reducers/formSlice';
import Labels from 'components/Labels';

interface FormLabels {
  name: string;
  title?: string;
  activeLabels?: string[];
}

const FormLabels: React.FC<FormLabels> = ({
  name,
  title,
  activeLabels = [],
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateData({ field: name, value: activeLabels }));
  }, []);

  const handleChange = (labels: string[]) => {
    dispatch(updateData({ field: name, value: labels }));
  };

  return (
    <FormItem title={title} name={name}>
      <Labels
        activeLabels={activeLabels}
        onChange={handleChange}
        editable
        addable
      />
    </FormItem>
  );
};

export default FormLabels;
