import React, { ClassAttributes, PropsWithChildren } from 'react';

type FlexProps = ClassAttributes<HTMLDivElement> & {
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  rowGap?: string;
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties
};

const Flex: React.FC<PropsWithChildren<FlexProps>> = ({ children, flexDirection, rowGap, wrap, className, style }) => {
  const styleDiv: React.CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: flexDirection,
    gap: rowGap,
    flexWrap: wrap ? 'wrap' : 'nowrap'
  };

  return (
    <div className={className} style={styleDiv}>
      {children}
    </div>
  );
};

export default Flex;
