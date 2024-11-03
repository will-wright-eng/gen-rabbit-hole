import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import { Toaster } from "@/components/ui/toaster";
import { useFlowHandlers } from '../../hooks/useFlowHandlers';
import NodeDetailsDrawer from './NodeDetailsDrawer';
import { useFlow } from '../../hooks/useFlow';
import '@xyflow/react/dist/style.css';

const FlowCanvas = () => {
  const {
    flowData,
    flowError,
    isLoadingFlow,
    loadFlow,
    saveFlowData,
    updateNodeData,
    generateNodesFromContext,
    isGenerating
  } = useFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  
  const { handleConnect, handleNodeDragStop } = useFlowHandlers({ setEdges, setNodes });

  useEffect(() => {
    const initializeFlow = async () => {
      try {
        const flow = await loadFlow('default-flow');
        if (flow) {
          setNodes(flow.nodes || flowData.nodes);
          setEdges(flow.edges || flowData.edges);
        }
      } catch (error) {
        // Fallback data will be used automatically
        if (flowData) {
          setNodes(flowData.nodes);
          setEdges(flowData.edges);
        }
      }
    };

    initializeFlow();
  }, []);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const handleGenerateNodes = async (sourceNodeId, count) => {
    const generatedNodes = await generateNodesFromContext(sourceNodeId, count);

    // Add new nodes to the canvas
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    const positionedNodes = generatedNodes.map((node, index) => ({
      ...node,
      position: {
        x: sourceNode.position.x + 200,
        y: sourceNode.position.y + (index * 100)
      }
    }));

    // Add edges connecting to the source node
    const newEdges = positionedNodes.map(node => ({
      id: `e${sourceNodeId}-${node.id}`,
      source: sourceNodeId,
      target: node.id,
      type: 'default'
    }));

    setNodes(nodes => [...nodes, ...positionedNodes]);
    setEdges(edges => [...edges, ...newEdges]);
  };

  return (
    <div className="reactflow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
        onGenerateNodes={handleGenerateNodes}
      />
      <Toaster />
    </div>
  );
};

export default FlowCanvas;

