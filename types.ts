export enum NodeType {
  COMPOUND = 'COMPOUND',
  PROTEIN = 'PROTEIN'
}

export interface GraphNode {
  id: string;
  group: NodeType;
  val: number; // For visualization size
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string | any; // d3 replaces string id with node object
  target: string | any;
  value: number; // Strength
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface Prediction {
  id: string;
  compoundId: string;
  compoundName: string;
  proteinId: string;
  proteinName: string;
  probability: number;
  status: 'New' | 'Validated' | 'Investigating';
}

export interface TrainingMetric {
  epoch: number;
  loss: number;
  auroc: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  GRAPH_EXPLORER = 'GRAPH_EXPLORER',
  TRAINING = 'TRAINING',
  PREDICTIONS = 'PREDICTIONS',
  DATA_UPLOAD = 'DATA_UPLOAD',
}
