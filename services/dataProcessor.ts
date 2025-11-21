import { GraphData, GraphNode, GraphLink, NodeType, Prediction } from '../types';

export const parseCSV = (text: string): any[] => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  
  // Simple CSV parser handling basic comma separation
  // Remove quotes and trim whitespace
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map((line, idx) => {
    if (!line.trim()) return null;
    
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    
    const row: any = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  }).filter(r => r !== null);
};

export const processDatasets = (interactions: any[], features: any[]): { graph: GraphData, predictions: Prediction[] } => {
  const nodesMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  // 1. Process Interactions to build Graph Topology
  interactions.forEach(row => {
    // Support various header naming conventions common in bio-informatics
    const cId = row.compound_id || row.source || row.drug || row.compound;
    const pId = row.protein_id || row.target || row.protein;
    
    if (cId && pId) {
      // Ensure Nodes Exist
      if (!nodesMap.has(cId)) {
        nodesMap.set(cId, { 
          id: cId, 
          group: NodeType.COMPOUND, 
          val: 10 
        });
      }
      if (!nodesMap.has(pId)) {
        nodesMap.set(pId, { 
          id: pId, 
          group: NodeType.PROTEIN, 
          val: 15 
        });
      }

      // Create Link
      links.push({
        source: cId,
        target: pId,
        value: 1
      });
    }
  });

  // 2. Process Features (Optional - ensuring these nodes exist in graph)
  features.forEach(row => {
    const id = row.compound_id || row.id;
    if (id && !nodesMap.has(id)) {
       // If a compound has features but no known interactions in the interaction file, 
       // we still add it as an isolated node (or potentially connected if we had a similarity graph)
       nodesMap.set(id, {
         id: id,
         group: NodeType.COMPOUND,
         val: 10
       });
    }
  });

  const nodes = Array.from(nodesMap.values());
  
  // 3. Generate Mock Predictions based on new Topology
  // In a real production environment, this function would serialize the graph to PyG HeteroData
  // and send it to the Python backend for inference.
  // Here, we simulate the GNN finding "latent" links (missing edges) for demonstration.
  const predictions: Prediction[] = [];
  const compounds = nodes.filter(n => n.group === NodeType.COMPOUND);
  const proteins = nodes.filter(n => n.group === NodeType.PROTEIN);

  if (compounds.length > 0 && proteins.length > 0) {
    // Generate up to 10 hypotheses
    const existingLinks = new Set(links.map(l => `${l.source}-${l.target}`));
    
    let attempts = 0;
    while (predictions.length < 10 && attempts < 100) {
       attempts++;
       const c = compounds[Math.floor(Math.random() * compounds.length)];
       const p = proteins[Math.floor(Math.random() * proteins.length)];
       
       const linkKey = `${c.id}-${p.id}`;
       
       // If link doesn't exist in ground truth, it's a candidate for prediction
       if (!existingLinks.has(linkKey)) {
          // Avoid duplicates in predictions list
          if (!predictions.find(pred => pred.compoundId === c.id && pred.proteinId === p.id)) {
            predictions.push({
              id: `pred-new-${predictions.length}`,
              compoundId: c.id,
              compoundName: c.id, // Use ID as name for uploaded data
              proteinId: p.id,
              proteinName: p.id,
              probability: 0.70 + (Math.random() * 0.29), // Random high prob for demo
              status: 'New'
            });
          }
       }
    }
  }

  return {
    graph: { nodes, links },
    predictions: predictions.sort((a, b) => b.probability - a.probability)
  };
};
