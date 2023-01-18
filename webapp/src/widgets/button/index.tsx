import { ButtonHTMLAttributes } from "react";
import './styles.css';

type ButtonVariantType = 'primary' | 'secondary' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariantType;
}

export default function Button(props: ButtonProps) {
  const disabledStyle = props.disabled ? `-disabled` : '';
  const variantStyle = `button-${props.variant}${disabledStyle}`;
  const labelVariantStyle = `button-label-${props.variant}`;
  return (
    <button className={`button font-size-small ${variantStyle} ${props.className || ''}`} type="button" onClick={props.onClick}>
      <span className={`button-label font-size-small ${labelVariantStyle}`}>{props.children}</span>
    </button>
  );
}