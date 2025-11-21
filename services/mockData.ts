import { GraphData, NodeType, Prediction, TrainingMetric } from '../types';

export const INITIAL_GRAPH_DATA: GraphData = {
  nodes: [
    { id: 'C1', group: NodeType.COMPOUND, val: 10 }, // Metformin
    { id: 'C2', group: NodeType.COMPOUND, val: 10 }, // Aspirin
    { id: 'C3', group: NodeType.COMPOUND, val: 10 }, // Atorvastatin
    { id: 'C4', group: NodeType.COMPOUND, val: 10 }, // Losartan
    { id: 'C5', group: NodeType.COMPOUND, val: 10 }, // Gabapentin
    { id: 'P1', group: NodeType.PROTEIN, val: 15 },  // AMPK
    { id: 'P2', group: NodeType.PROTEIN, val: 15 },  // COX-1
    { id: 'P3', group: NodeType.PROTEIN, val: 15 },  // HMG-CoA
    { id: 'P4', group: NodeType.PROTEIN, val: 15 },  // AGTR1
    { id: 'P5', group: NodeType.PROTEIN, val: 15 },  // CACNA2D1
    // Latent connections candidates
    { id: 'P6', group: NodeType.PROTEIN, val: 15 },  // MTOR
    { id: 'P7', group: NodeType.PROTEIN, val: 15 },  // NF-kB
  ],
  links: [
    { source: 'C1', target: 'P1', value: 1 },
    { source: 'C2', target: 'P2', value: 1 },
    { source: 'C3', target: 'P3', value: 1 },
    { source: 'C4', target: 'P4', value: 1 },
    { source: 'C5', target: 'P5', value: 1 },
    // Interaction network (Protein-Protein)
    { source: 'P1', target: 'P6', value: 0.5 },
    { source: 'P6', target: 'P7', value: 0.5 },
    { source: 'P2', target: 'P7', value: 0.5 },
  ]
};

export const PREDICTIONS_DATA: Prediction[] = [
  { id: '1', compoundId: 'C1', compoundName: 'Metformin', proteinId: 'P6', proteinName: 'mTOR', probability: 0.92, status: 'New' },
  { id: '2', compoundId: 'C3', compoundName: 'Atorvastatin', proteinId: 'P7', proteinName: 'NF-kB', probability: 0.89, status: 'New' },
  { id: '3', compoundId: 'C2', compoundName: 'Aspirin', proteinId: 'P1', proteinName: 'AMPK', probability: 0.87, status: 'Investigating' },
  { id: '4', compoundId: 'C4', compoundName: 'Losartan', proteinId: 'P2', proteinName: 'COX-2', probability: 0.85, status: 'New' },
  { id: '5', compoundId: 'C5', compoundName: 'Gabapentin', proteinId: 'P3', proteinName: 'Thrombospondin', probability: 0.84, status: 'New' },
  { id: '6', compoundId: 'C1', compoundName: 'Metformin', proteinId: 'P9', proteinName: 'HER2', probability: 0.81, status: 'New' },
  { id: '7', compoundId: 'C6', compoundName: 'Rapamycin', proteinId: 'P10', proteinName: 'Insulin Receptor', probability: 0.78, status: 'New' },
  { id: '8', compoundId: 'C7', compoundName: 'Doxycycline', proteinId: 'P11', proteinName: 'MMP-9', probability: 0.76, status: 'Validated' },
  { id: '9', compoundId: 'C3', compoundName: 'Atorvastatin', proteinId: 'P12', proteinName: 'Rho kinase', probability: 0.75, status: 'New' },
  { id: '10', compoundId: 'C8', compoundName: 'Sildenafil', proteinId: 'P13', proteinName: 'PDE5', probability: 0.99, status: 'Validated' },
];

export const TRAINING_METRICS: TrainingMetric[] = Array.from({ length: 50 }, (_, i) => ({
  epoch: i + 1,
  loss: Math.max(0.1, 2.5 * Math.exp(-0.1 * i) + Math.random() * 0.05),
  auroc: Math.min(0.91, 0.5 + 0.4 * (1 - Math.exp(-0.08 * i)) + Math.random() * 0.02),
}));
