'use client';

import CheckIcon from '@mui/icons-material/Check';
import { useAutocomplete } from '@mui/material';

import { InputWrapper, Listbox, SearchRoot, StyledTag } from './styled';

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
    getOptionLabel: (option: TagOptionType) => option,
    options: allTags,
  });

  return (
    <SearchRoot>
      <div { ...getRootProps() }>
        <InputWrapper ref={ setAnchorEl } className={ focused ? 'focused' : '' }>
          { value.map((option: TagOptionType, index: number) => (
            // eslint-disable-next-line react/jsx-key
            <StyledTag label={ option } { ...getTagProps({ index }) } />
          )) }
          <input
            disabled={ true }
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
          { (groupedOptions as TagOptionType[]).map((option: TagOptionType, index: number) => (
            <li key={ index } { ...getOptionProps({ option, index }) }>
              <span>{ option }</span>
              <CheckIcon fontSize="small" />
            </li>
          )) }
        </Listbox>
      ) : null }

    </SearchRoot>
  );
};

export default Search;

type TagOptionType = string;

const allTags = ['test'];
