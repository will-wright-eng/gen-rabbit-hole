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
    },
    {
      id: 'node-1',
      type: 'default',
      position: { x: -200, y: 100 },
      data: {
        label: 'Option A',
        description: 'First branch of the story',
        metadata: {
          type: 'choice',
          category: 'story',
          createdAt: '2024-03-01T00:00:00.000Z'
        }
      }
    },
    {
      id: 'node-2',
      type: 'default',
      position: { x: 0, y: 100 },
      data: {
        label: 'Option B',
        description: 'Second branch of the story',
        metadata: {
          type: 'choice',
          category: 'story',
          createdAt: '2024-03-01T00:00:00.000Z'
        }
      }
    },
    {
      id: 'node-3',
      type: 'default',
      position: { x: 200, y: 100 },
      data: {
        label: 'Option C',
        description: 'Third branch of the story',
        metadata: {
          type: 'choice',
          category: 'story',
          createdAt: '2024-03-01T00:00:00.000Z'
        }
      }
    }
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'root',
      target: 'node-1'
    },
    {
      id: 'edge-2',
      source: 'root',
      target: 'node-2'
    },
    {
      id: 'edge-3',
      source: 'root',
      target: 'node-3'
    }
  ]
};
