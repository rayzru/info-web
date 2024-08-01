import { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

import { Tag, TagProps } from './Tag';

export const StyledTag = styled(Tag) <TagProps>`
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

export const InputWrapper = styled('div')`
  width: 100%;
  border-radius: 20px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  transition: box-shadow .3s;
  &:hover {
  }

  &.focused {
    box-shadow: 0 0 0 2px rgba(120,140,200, .4);
  }

  & input {
    height: 30px;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

export const Listbox = styled('ul')`
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

export const SearchRoot = styled('div')`
  font-size: 14px;
  margin: 0 24px ;
  flex: 1;
`;
