import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import { Plus } from 'lucide-react';
import '@xyflow/react/dist/style.css';

import { TopicNode } from './nodes/TopicNode';
import { MindMapEdge } from './edges/MindMapEdge';
import type { MindMapNode, MindMapEdge } from './types';

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'topic',
    position: { x: 0, y: 0 },
    data: { label: 'Main Topic' },
  },
];

const nodeTypes = {
  topic: TopicNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

export default function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'mindmap' }, eds)),
    []
  );

  const addChildNode = useCallback(
    (parentNode: MindMapNode) => {
      const newNodeId = `node_${nodes.length + 1}`;
      const parentPos = parentNode.position;
      
      const newNode: MindMapNode = {
        id: newNodeId,
        type: 'topic',
        position: {
          x: parentPos.x + 250,
          y: parentPos.y + Math.random() * 100 - 50,
        },
        data: {
          label: 'New Topic',
        },
      };

      const newEdge: MindMapEdge = {
        id: `edge_${edges.length + 1}`,
        source: parentNode.id,
        target: newNodeId,
        type: 'mindmap',
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      className="bg-gray-50"
    >
      <Controls />
      <MiniMap nodeStrokeWidth={3} zoomable pannable />
      <Background gap={12} size={1} />

      <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              const selectedNodes = nodes.filter((node) => node.selected);
              if (selectedNodes.length === 1) {
                addChildNode(selectedNodes[0]);
              }
            }}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Plus size={16} />
            Add Child Node
          </button>
        </div>
      </Panel>
    </ReactFlow>
  );
}

