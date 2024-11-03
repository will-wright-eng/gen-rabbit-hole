import { useApi } from './useApi';
import { MOCK_FLOW_DATA } from '../lib/mock-data/flow';

export function useFlow() {
  const {
    data: flowData,
    error: flowError,
    isLoading: isLoadingFlow,
    execute: fetchFlow
  } = useApi('/api/flow', { fallbackData: MOCK_FLOW_DATA });

  const {
    execute: saveFlow
  } = useApi('/api/flow', {
    method: 'POST',
    fallbackData: MOCK_FLOW_DATA
  });

  const {
    execute: updateNode
  } = useApi('/api/flow/node', {
    method: 'PUT',
    fallbackData: null
  });

  const loadFlow = async (flowId) => {
    try {
      return await fetchFlow(null, { params: { flowId } });
    } catch (error) {
      console.error('Failed to load flow:', error);
      // Error is already handled by useApi with fallback data
      return error;
    }
  };

  const saveFlowData = async (flow) => {
    try {
      return await saveFlow(flow);
    } catch (error) {
      console.error('Failed to save flow:', error);
      return MOCK_FLOW_DATA;
    }
  };

  const updateNodeData = async (nodeId, data) => {
    try {
      return await updateNode(data, { params: { nodeId } });
    } catch (error) {
      console.error('Failed to update node:', error);
      // Return the updated node data as fallback
      return { ...data, id: nodeId };
    }
  };

  return {
    flowData,
    flowError,
    isLoadingFlow,
    loadFlow,
    saveFlowData,
    updateNodeData,
  };
}
