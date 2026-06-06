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
  { 
    id: '1', 
    compoundId: 'C1', 
    compoundName: 'Metformin', 
    proteinId: 'P6', 
    proteinName: 'mTOR', 
    probability: 0.925, 
    status: 'New',
    provenance: 'DrugBank DB00331 (ChEMBL1431)',
    targetProvenance: 'OpenTargets ENSG00000198793',
    ragScore: 0.88,
    pathways: ['mTOR Signaling Pathway', 'PI3K-Akt Pathway', 'AMPK/mTOR Axis'],
    attentionWeights: [
      { node: 'Metformin', weight: 0.42 },
      { node: 'AMPK (P1)', weight: 0.31 },
      { node: 'PI3K-Akt', weight: 0.18 },
      { node: 'mTOR', weight: 0.09 }
    ]
  },
  { 
    id: '2', 
    compoundId: 'C3', 
    compoundName: 'Atorvastatin', 
    proteinId: 'P7', 
    proteinName: 'NF-kB', 
    probability: 0.894, 
    status: 'New',
    provenance: 'DrugBank DB01076 (ChEMBL1487)',
    targetProvenance: 'STRING 9606.ENSP00000263388',
    ragScore: 0.79,
    pathways: ['NF-kappa B Signaling', 'Apoptosis Network', 'Inflammatory Mediators'],
    attentionWeights: [
      { node: 'Atorvastatin', weight: 0.48 },
      { node: 'HMG-CoA (P3)', weight: 0.28 },
      { node: 'Rho kinase', weight: 0.15 },
      { node: 'NF-kB', weight: 0.09 }
    ]
  },
  { 
    id: '3', 
    compoundId: 'C2', 
    compoundName: 'Aspirin', 
    proteinId: 'P1', 
    proteinName: 'AMPK', 
    probability: 0.871, 
    status: 'Investigating',
    provenance: 'DrugBank DB00945 (ChEMBL25)',
    targetProvenance: 'STRING 9606.ENSP00000300300',
    ragScore: 0.91,
    pathways: ['AMPK Activated Kinase cascade', 'Cellular Energy Homeostasis', 'Aspirin-induced Autophagy'],
    attentionWeights: [
      { node: 'Aspirin', weight: 0.35 },
      { node: 'COX-1 (P2)', weight: 0.33 },
      { node: 'NF-kB', weight: 0.20 },
      { node: 'AMPK', weight: 0.12 }
    ]
  },
  { 
    id: '4', 
    compoundId: 'C4', 
    compoundName: 'Losartan', 
    proteinId: 'P2', 
    proteinName: 'COX-2', 
    probability: 0.852, 
    status: 'New',
    provenance: 'DrugBank DB00678',
    targetProvenance: 'OpenTargets ENSG00000073756',
    ragScore: 0.64,
    pathways: ['Renin-Angiotensin Cascade', 'Prostaglandin Biosynthesis', 'Inflammation Resolution'],
    attentionWeights: [
      { node: 'Losartan', weight: 0.44 },
      { node: 'AGTR1 (P4)', weight: 0.36 },
      { node: 'COX-2', weight: 0.20 }
    ]
  },
  { 
    id: '5', 
    compoundId: 'C5', 
    compoundName: 'Gabapentin', 
    proteinId: 'P3', 
    proteinName: 'Thrombospondin', 
    probability: 0.839, 
    status: 'New',
    provenance: 'ChEMBL940',
    targetProvenance: 'Uniprot P35443',
    ragScore: 0.72,
    pathways: ['Calcium Channel Complex', 'Synaptogenesis Regulation', 'Neuropathic Signalling'],
    attentionWeights: [
      { node: 'Gabapentin', weight: 0.51 },
      { node: 'CACNA2D1 (P5)', weight: 0.31 },
      { node: 'Thrombospondin', weight: 0.18 }
    ]
  },
  { 
    id: '6', 
    compoundId: 'C1', 
    compoundName: 'Metformin', 
    proteinId: 'P7', 
    proteinName: 'NF-kB', 
    probability: 0.812, 
    status: 'New',
    provenance: 'DrugBank DB00331',
    targetProvenance: 'STRING 9606.ENSP00000263388',
    ragScore: 0.83,
    pathways: ['NF-kappa B Signaling', 'AMPK Regulatory Subunits', 'Anti-inflammatory Pathways'],
    attentionWeights: [
      { node: 'Metformin', weight: 0.39 },
      { node: 'AMPK (P1)', weight: 0.37 },
      { node: 'NF-kB', weight: 0.24 }
    ]
  },
  { 
    id: '7', 
    compoundId: 'C6', 
    compoundName: 'Rapamycin', 
    proteinId: 'P1', 
    proteinName: 'AMPK', 
    probability: 0.785, 
    status: 'New',
    provenance: 'DrugBank DB00877 (ChEMBL)',
    targetProvenance: 'Uniprot Q13131',
    ragScore: 0.86,
    pathways: ['Autophagy Regulation', 'mTOR Complex Inhibition', 'Nutrient Sensing'],
    attentionWeights: [
      { node: 'Rapamycin', weight: 0.45 },
      { node: 'mTOR (P6)', weight: 0.40 },
      { node: 'AMPK', weight: 0.15 }
    ]
  },
  { 
    id: '8', 
    compoundId: 'C7', 
    compoundName: 'Doxycycline', 
    proteinId: 'P8', 
    proteinName: 'MMP-9', 
    probability: 0.941, 
    status: 'Validated',
    provenance: 'ChEMBL1433',
    targetProvenance: 'OpenTargets ENSG00000100985',
    ragScore: 0.94,
    pathways: ['Extracellular Matrix Degradation', 'Metalloproteinase Regulation', 'Tissue Remodeling'],
    attentionWeights: [
      { node: 'Doxycycline', weight: 0.58 },
      { node: 'MMP-9', weight: 0.42 }
    ]
  },
  { 
    id: '9', 
    compoundId: 'C3', 
    compoundName: 'Atorvastatin', 
    proteinId: 'P9', 
    proteinName: 'Rho kinase', 
    probability: 0.752, 
    status: 'New',
    provenance: 'DrugBank DB01076',
    targetProvenance: 'Uniprot Q13464',
    ragScore: 0.77,
    pathways: ['Actin Cytoskeleton Organization', 'Endothelial NO Synthase Cascade', 'Statins Pleiotropic Interventions'],
    attentionWeights: [
      { node: 'Atorvastatin', weight: 0.49 },
      { node: 'HMG-CoA (P3)', weight: 0.31 },
      { node: 'Rho kinase', weight: 0.20 }
    ]
  },
  { 
    id: '10', 
    compoundId: 'C8', 
    compoundName: 'Sildenafil', 
    proteinId: 'P10', 
    proteinName: 'PDE5', 
    probability: 0.994, 
    status: 'Validated',
    provenance: 'DrugBank DB00203 (ChEMBL2)',
    targetProvenance: 'STRING 9606.ENSP00000256111',
    ragScore: 0.98,
    pathways: ['cGMP-specific Phosphodiesterase Pathway', 'Nitric Oxide Signaling', 'Vasodilation cascade'],
    attentionWeights: [
      { node: 'Sildenafil', weight: 0.65 },
      { node: 'PDE5', weight: 0.35 }
    ]
  },
];

export const TRAINING_METRICS: TrainingMetric[] = Array.from({ length: 50 }, (_, i) => ({
  epoch: i + 1,
  loss: Math.max(0.1, 2.5 * Math.exp(-0.1 * i) + Math.random() * 0.05),
  auroc: Math.min(0.91, 0.5 + 0.4 * (1 - Math.exp(-0.08 * i)) + Math.random() * 0.02),
}));
