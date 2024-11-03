export const MOCK_FLOW_DATA = {
  nodes: [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: {
        label: 'Start',
        description: 'Entry point of the flow',
        metadata: {
          createdAt: '2024-03-15',
          category: 'input'
        }
      },
      type: 'default'
    },
    {
      id: '2',
      position: { x: 0, y: 100 },
      data: {
        label: 'Process',
        description: 'Main processing step',
        metadata: {
          createdAt: '2024-03-15',
          category: 'process'
        }
      },
      type: 'default'
    },
    {
      id: '3',
      position: { x: 0, y: 200 },
      data: {
        label: 'End',
        description: 'Flow completion',
        metadata: {
          createdAt: '2024-03-15',
          category: 'output'
        }
      },
      type: 'default'
    }
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', type: 'default' },
    { id: 'e2-3', source: '2', target: '3', type: 'default' }
  ]
};

