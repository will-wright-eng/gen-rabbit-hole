'use client';

import { ReactNode } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

interface FlowWrapperProps {
  children: ReactNode;
}

export function FlowWrapper({ children }: FlowWrapperProps) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
