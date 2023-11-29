import { ChangeEvent, ChangeEventHandler, forwardRef } from 'react';
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
        mask="+0 (000) 000-00-00"
        inputRef={ ref }
        onAccept={ (value: any) => onChange({ target: { name: props.name, value } } as ChangeEvent<HTMLInputElement>) }
        overwrite
      />
    );
  },
);

export default PhoneInput;
