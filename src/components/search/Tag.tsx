import { CloseRounded } from '@mui/icons-material';
import { AutocompleteGetTagProps } from '@mui/material';

export interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

export function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div { ...other }>
      <span>{ label }</span>
      <CloseRounded onClick={ onDelete } />
    </div>
  );
}
