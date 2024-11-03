import { useNodesState, useEdgesState } from '@xyflow/react';
import { useFlow } from './useFlow';
import { FLOW_DEFAULTS } from '@/features/flow/constants';

export const useFlowState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {
    flowData,
    flowError,
    isLoadingFlow,
    loadFlow,
    saveFlowData,
    updateNodeData,
    generateNodesFromContext,
    isGenerating
  } = useFlow();

  const initializeFlow = async () => {
    try {
      const flow = await loadFlow(FLOW_DEFAULTS.DEFAULT_FLOW_ID);
      if (flow) {
        setNodes(flow.nodes || flowData.nodes);
        setEdges(flow.edges || flowData.edges);
      }
    } catch (error) {
      if (flowData) {
        setNodes(flowData.nodes);
        setEdges(flowData.edges);
      }
    }
  };

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    flowError,
    isLoadingFlow,
    initializeFlow,
    saveFlowData,
    updateNodeData,
    generateNodesFromContext,
    isGenerating
  };
};
