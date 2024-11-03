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
