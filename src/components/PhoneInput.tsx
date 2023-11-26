import { ChangeEventHandler, forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

interface CustomProps {
  onChange: ChangeEventHandler;
  name: string;
}

const PhoneInput = forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        { ...other }
        mask="+7 (#00) 000-00-00"
        definitions={ {
          '#': /[1-9]/,
        } }
        inputRef={ ref }
        onAccept={ (value: any) => onChange({ target: { name: props.name, value } }) }
        overwrite
      />
    );
  },
);

export default PhoneInput;
