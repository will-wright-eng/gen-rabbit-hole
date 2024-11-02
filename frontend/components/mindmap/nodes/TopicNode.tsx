import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface TopicNodeProps {
  data: {
    label: string;
    content?: string;
  };
  isConnectable: boolean;
}

export const TopicNode = memo(({ data, isConnectable }: TopicNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-gray-200">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-teal-500"
      />
      <div className="flex flex-col">
        <div className="font-semibold text-sm">{data.label}</div>
        {data.content && (
          <div className="text-xs text-gray-500">{data.content}</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-teal-500"
      />
    </div>
  );
});

TopicNode.displayName = 'TopicNode';

