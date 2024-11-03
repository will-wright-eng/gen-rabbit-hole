export const INITIAL_NODES = [
  { 
    id: '1', 
    position: { x: 0, y: 0 }, 
    data: { 
      label: 'Node 1',
      description: 'This is the first node',
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
      label: 'Node 2',
      description: 'This is the second node',
      metadata: {
        createdAt: '2024-03-15',
        category: 'process'
      }
    },
    type: 'default'
  },
];

export const INITIAL_EDGES = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    type: 'default'
  }
];
