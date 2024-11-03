import { NODE_TEMPLATES } from './node-templates';

export class NodeGenerator {
  static generateNodes(sourceNode, count = 1, graphContext = null) {
    const templates = Object.keys(NODE_TEMPLATES);
    const nodes = [];

    for (let i = 0; i < count; i++) {
      const templateKey = templates[Math.floor(Math.random() * templates.length)];
      const template = NODE_TEMPLATES[templateKey];

      const node = {
        id: `generated-${Date.now()}-${i}`,
        type: template.type,
        position: { x: 0, y: 0 }, // Position will be calculated by the FlowCanvas
        data: {
          ...template.data,
          label: `${template.data.label} ${i + 1}`,
          description: this.generateDescription(sourceNode, template, i),
          metadata: {
            ...template.data.metadata,
            createdAt: new Date().toISOString(),
            generation: {
              sourceNodeId: sourceNode.id,
              prompt: `Generated from ${sourceNode.data.label}`,
              sequence: i + 1
            }
          }
        }
      };

      nodes.push(node);
    }

    return nodes;
  }

  static generateDescription(sourceNode, template, index) {
    const descriptions = [
      `Generated from ${sourceNode.data.label}`,
      `A ${template.data.metadata.type} node created from the parent node`,
      `Expansion ${index + 1} of the ${sourceNode.data.label} node`,
      `Auto-generated ${template.data.metadata.type} node`
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
}

// import { generateDescription, generateNodeStyle } from './node-templates';

// export const generateMockNodes = (sourceNode, count = 1) => {
//   const nodes = [];
//   const baseType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
//   const category = nodeCategories[Math.floor(Math.random() * nodeCategories.length)];
//   const templates = nodeTemplates[baseType];

//   for (let i = 0; i < count; i++) {
//     const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
//     const template = templates[Math.floor(Math.random() * templates.length)];

//     nodes.push({
//       id: `generated-${Date.now()}-${i}`,
//       type: 'default',
//       position: {
//         x: sourceNode.position.x + 200,
//         y: sourceNode.position.y + (i * 100)
//       },
//       data: {
//         label: `${template} ${i + 1}`,
//         description: generateDescription(type),
//         metadata: {
//           createdAt: new Date().toISOString(),
//           category,
//           type,
//           sourceNodeId: sourceNode.id,
//           generation: {
//             prompt: `Generated from ${sourceNode.data.label}`,
//             timestamp: Date.now(),
//             sequence: i + 1
//           }
//         },
//         style: generateNodeStyle(type)
//       }
//     });
//   }

//   return {
//     nodes,
//     edges: nodes.map(node => ({
//       id: `e${sourceNode.id}-${node.id}`,
//       source: sourceNode.id,
//       target: node.id,
//       type: 'default',
//       data: {
//         createdAt: new Date().toISOString(),
//         type: 'generated'
//       }
//     }))
//   };
// };

