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
import { useFlowHandlers } from '../../hooks/useFlowHandlers';
import NodeDetailsDrawer from './NodeDetailsDrawer';
import { useFlow } from '../../hooks/useFlow';
import '@xyflow/react/dist/style.css';
// import { INITIAL_NODES, INITIAL_EDGES } from './flowConfig';

const FlowCanvas = () => {
  const {
    flowData,
    flowError,
    isLoadingFlow,
    loadFlow,
    saveFlowData,
    updateNodeData
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

