'use client';

import { CloseRounded } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { AutocompleteGetTagProps, useAutocomplete } from '@mui/material';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div { ...other }>
      <span>{ label }</span>
      <CloseRounded onClick={ onDelete } />
    </div>
  );
}

const StyledTag = styled(Tag) <TagProps>`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const InputWrapper = styled('div')`
  width: 100%;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
  }

  &.focused {
    box-shadow: 0 0 0 2px darkblue;
  }

  & input {
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

const Listbox = styled('ul')`
  background-color: white;
  width: fit-content;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  overflow: auto;
  max-height: 250px;
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    font-weight: 600;
    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    cursor: pointer;
    & svg {
      color: currentColor;
    }
  }
`;

const Root = styled('div')`
  font-size: 14px;
  margin: 0 24px ;
`;

const Search = () => {
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    defaultValue: [],
    multiple: true,
    getOptionLabel: (option: FilmOptionType) => option.title,
    options: top100Films,
  });

  return (
    <Root>
      <div { ...getRootProps() }>
        <InputWrapper ref={ setAnchorEl } className={ focused ? 'focused' : '' }>
          { value.map((option: FilmOptionType, index: number) => (
            <StyledTag label={ option.title } { ...getTagProps({ index }) } />
          )) }
          <input
            name='srch'
            { ...getInputProps() }
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </InputWrapper>
      </div>

      { groupedOptions.length > 0 ? (
        <Listbox { ...getListboxProps() } >
          { (groupedOptions as FilmOptionType[]).map((option: FilmOptionType, index: number) => (
            <li key={ index } { ...getOptionProps({ option, index }) }>
              <span>{ option.title }</span>
              <CheckIcon fontSize="small" />
            </li>
          )) }
        </Listbox>
      ) : null }
    </Root>
  );
};

export default Search;

interface FilmOptionType {
  title: string;
  year: number;
}

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
];
