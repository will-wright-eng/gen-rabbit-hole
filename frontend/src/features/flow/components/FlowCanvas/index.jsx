import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background } from '@xyflow/react';
import { Toaster } from "@/components/ui/toaster";
import { useFlowHandlers } from '../../hooks/useFlowHandlers';
import { useFlowState } from '../../hooks/useFlowState';
import NodeDetailsDrawer from '../NodeDetails';
import '@xyflow/react/dist/style.css';
import { calculateNodePosition, createEdge } from '../../utils/flowUtils';

const FlowCanvas = React.forwardRef((props, ref) => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    initializeFlow,
    generateNodesFromContext
  } = useFlowState();
  
  const [selectedNode, setSelectedNode] = useState(null);
  const { handleConnect, handleNodeDragStop } = useFlowHandlers({ setEdges, setNodes });

  useEffect(() => {
    initializeFlow();
  }, []);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const handleGenerateNodes = async (sourceNodeId, count) => {
    const generatedNodes = await generateNodesFromContext(sourceNodeId, count, nodes, edges);
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    
    const positionedNodes = generatedNodes.map((node, index) => ({
      ...node,
      position: calculateNodePosition(sourceNode, index)
    }));

    const newEdges = positionedNodes.map(node => 
      createEdge(sourceNodeId, node.id)
    );

    setNodes(nodes => [...nodes, ...positionedNodes]);
    setEdges(edges => [...edges, ...newEdges]);
  };

  // Expose resetFlow method via ref
  React.useImperativeHandle(ref, () => ({
    resetFlow: initializeFlow
  }));

  return (
    <div className="reactflow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onConnect={handleConnect}
        onNodeDragStop={handleNodeDragStop}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <NodeDetailsDrawer 
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onGenerateNodes={handleGenerateNodes}
        edges={edges}
      />
      <Toaster />
    </div>
  );
});

export default FlowCanvas;
