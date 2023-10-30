import React from 'react';
import { Tooltip } from 'antd';

interface ReportColumnToolTipsProps {
  text: string;
  children: React.ReactNode;
}

export const ReportToolTipTitle = (props: ReportColumnToolTipsProps) => {
  return (
    <div>
      {props.children}
    </div>
  );
};