import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import { useFlowHandlers } from '../../hooks/useFlowHandlers';
import { INITIAL_NODES, INITIAL_EDGES } from './flowConfig';
import NodeDetailsDrawer from './NodeDetailsDrawer';
import '@xyflow/react/dist/style.css';

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState(null);
  
  const { handleConnect, handleNodeDragStop } = useFlowHandlers({ setEdges, setNodes });

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="reactflow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeDragStop={handleNodeDragStop}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <NodeDetailsDrawer 
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};

export default FlowCanvas;

