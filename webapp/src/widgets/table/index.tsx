import React, { ClassAttributes } from 'react';
import Flex from '../flex';

const rowStyle = {
  padding: '2px',
  height: '24px',
};

type TableProps = ClassAttributes<HTMLDivElement> & {
  columnNames: string[];
  rows: Record<string, any>[];
  className?: string;
};

const Table: React.FC<TableProps> = ({ columnNames, rows, className }) => {
  return (
    <Flex flexDirection="row" rowGap="12px">
      {columnNames.map(c => (<div>
        <Flex flexDirection="column" rowGap="8px">
          <div style={rowStyle}>{c}</div>
        </Flex>
        {rows.map(row => <Flex flexDirection="column" rowGap="8px">
          <div style={rowStyle}>
            {row[c]}
          </div>
        </Flex>)}
      </div>))}
    </Flex>
  );
};

export default Table;