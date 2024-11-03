import { useApi } from '@/hooks/useApi';
import { MOCK_FLOW_DATA } from '@/lib/mock-data/flow';
import { NodeGenerator } from '@/lib/mock-data/node-generator';
import { serializeGraphState } from '../utils/flowUtils';

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

  const {
    execute: generateNodes,
    isLoading: isGenerating
  } = useApi('/api/flow/generate', {
    method: 'POST',
    fallbackData: {
      nodes: [
        {
          id: `generated-${Date.now()}`,
          position: { x: 200, y: 0 },
          data: {
            label: 'Generated Node',
            description: 'AI-generated node',
            metadata: {
              createdAt: new Date().toISOString(),
              category: 'generated'
            }
          },
          type: 'default'
        }
      ]
    }
  });

  const generateNodesFromContext = async (nodeId, count = 1, nodes = [], edges = []) => {
    try {
      const graphContext = serializeGraphState(nodes, edges);

      const result = await generateNodes({
        sourceNodeId: nodeId,
        count,
        graphContext
      });

      return result.nodes;
    } catch (error) {
      console.error('Failed to generate nodes:', error);

      const sourceNode = nodes.find(n => n.id === nodeId);
      if (!sourceNode) {
        throw new Error('Source node not found');
      }

      return NodeGenerator.generateNodes(sourceNode, count, {
        nodes,
        edges
      });
    }
  };

  return {
    flowData,
    flowError,
    isLoadingFlow,
    loadFlow,
    saveFlowData,
    updateNodeData,
    generateNodesFromContext,
    isGenerating
  };
}
