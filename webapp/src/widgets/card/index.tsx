import React, { ClassAttributes, MouseEventHandler, PropsWithChildren } from 'react';
import './styles.css';

type CardProps = ClassAttributes<HTMLDivElement> & {
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Card: React.FC<PropsWithChildren<CardProps>> = ({ title, children, className, style, onClick }) => {
  return (
    <div onClick={onClick} className={`card border border-thin border-primary ${className}`} style={style}>
      {title && (<div className="card-header">
        {title}
      </div>)}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
