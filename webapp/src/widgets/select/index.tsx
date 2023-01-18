import { SelectHTMLAttributes, useState } from "react";
import './styles.css';

function ExpandLessIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="24"
      width="24"
      fill="inherit"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>
  );
}

export function ExpandMoreIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="24"
      width="24"
      fill="inherit"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  );
}

interface SelectListOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectListOption[];
  onItemSelect?: (key: string) => void;
}

export default function Select(props: SelectProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const onExpandHandler = () => setExpanded(!expanded);
  const onItemSelect = (value: string): void => {
    setExpanded(false);
    if (props.onItemSelect) props.onItemSelect(value);
  };
  
  const selectedValue = props.value ? props.value.toString() : undefined;
  const selectedLabel = props.value ? props.options.find((e) => e.value === selectedValue)?.label : '';
  console.log(typeof selectedValue, selectedLabel);
  return (
    <div className="selectContainer border-thin bg-primary">
      <input
        className="selectInput"
        type="text"
        placeholder={props.placeholder}
        value={selectedLabel}
        readOnly
        onClick={onExpandHandler}
      />
      <button type="button" onClick={onExpandHandler} className="selectButton border-thin border-primary">
        {expanded ? (
          <ExpandLessIcon />
        ) : (
          <ExpandMoreIcon />
        )}
      </button>
      {expanded && props.options.length > 0 && (
        <div className="selectOptionContainer bg-primary">
          <div className="selectOptionFrame">
            {props.options.map((e, i) => (
              <button
                key={e.value}
                className="selectListItem"
                onClick={(event) => onItemSelect(e.value)}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}