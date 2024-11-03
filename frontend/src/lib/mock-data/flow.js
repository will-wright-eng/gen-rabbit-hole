export const MOCK_FLOW_DATA = {
  nodes: [
    {
      id: 'root',
      type: 'default',
      position: { x: 0, y: 0 },
      data: {
        label: 'Root Node',
        description: 'Starting point of the flow',
        metadata: {
          type: 'root',
          category: 'system',
          createdAt: '2024-03-01T00:00:00.000Z'
        }
      }
    }
  ],
  edges: []
};
