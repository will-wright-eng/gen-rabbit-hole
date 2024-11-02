import { Node, Edge } from '@xyflow/react';

export interface MindMapNode extends Node {
  data: {
    label: string;
    content?: string;
  };
}

export interface MindMapEdge extends Edge {
  type?: 'mindmap';
}

