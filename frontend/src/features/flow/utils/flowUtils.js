import { FLOW_DEFAULTS } from '../constants';

export const calculateNodePosition = (sourceNode, index) => ({
  x: sourceNode.position.x + FLOW_DEFAULTS.NODE_SPACING.HORIZONTAL,
  y: sourceNode.position.y + (index * FLOW_DEFAULTS.NODE_SPACING.VERTICAL)
});

export const createEdge = (sourceId, targetId) => ({
  id: `e${sourceId}-${targetId}`,
  source: sourceId,
  target: targetId,
  type: 'default'
});

export const serializeGraphState = (nodes, edges) => ({
  nodes: nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: { ...node.position },
    data: { ...node.data }
  })),
  edges: edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type
  }))
});
