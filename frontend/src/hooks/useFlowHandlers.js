import { useCallback } from 'react';
import { addEdge } from '@xyflow/react';

export const useFlowHandlers = ({ setEdges, setNodes }) => {
  const handleConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeDragStop = useCallback(
    (event, node) => {
      console.log('Node position updated:', node);
      //Add any additional logic for node position updates
    },
    []
  );

  return {
    handleConnect,
    handleNodeDragStop,
  };
};
