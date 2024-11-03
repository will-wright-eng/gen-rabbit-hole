import { generateDescription, generateNodeStyle } from './node-templates';

export const generateMockNodes = (sourceNode, count = 1) => {
  const nodes = [];
  const baseType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
  const category = nodeCategories[Math.floor(Math.random() * nodeCategories.length)];
  const templates = nodeTemplates[baseType];

  for (let i = 0; i < count; i++) {
    const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    nodes.push({
      id: `generated-${Date.now()}-${i}`,
      type: 'default',
      position: {
        x: sourceNode.position.x + 200,
        y: sourceNode.position.y + (i * 100)
      },
      data: {
        label: `${template} ${i + 1}`,
        description: generateDescription(type),
        metadata: {
          createdAt: new Date().toISOString(),
          category,
          type,
          sourceNodeId: sourceNode.id,
          generation: {
            prompt: `Generated from ${sourceNode.data.label}`,
            timestamp: Date.now(),
            sequence: i + 1
          }
        },
        style: generateNodeStyle(type)
      }
    });
  }

  return {
    nodes,
    edges: nodes.map(node => ({
      id: `e${sourceNode.id}-${node.id}`,
      source: sourceNode.id,
      target: node.id,
      type: 'default',
      data: {
        createdAt: new Date().toISOString(),
        type: 'generated'
      }
    }))
  };
};

