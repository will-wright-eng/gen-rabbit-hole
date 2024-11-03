type Position = {
  x: number;
  y: number;
};

type NodeMetadata = {
  type?: string;
  category?: string;
  createdAt: string;
  generation?: {
    prompt: string;
    sequence: number;
  };
};

type NodeData = {
  label: string;
  description: string;
  metadata: NodeMetadata;
};

type FlowNode = {
  id: string;
  position: Position;
  data: NodeData;
  type: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  type: string;
};

type Flow = {
  nodes: FlowNode[];
  edges: Edge[];
};
