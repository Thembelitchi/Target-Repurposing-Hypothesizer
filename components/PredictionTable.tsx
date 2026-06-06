import React, { useState } from 'react';
import { Prediction } from '../types';
import { 
  Download, 
  Sparkles, 
  Microscope, 
  ExternalLink, 
  X, 
  BookOpen, 
  Layers, 
  GitFork, 
  Percent, 
  Database,
  ExternalLink as PubIcon
} from 'lucide-react';

interface PredictionTableProps {
  predictions: Prediction[];
}

const PredictionTable: React.FC<PredictionTableProps> = ({ predictions }) => {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const handleAnalyze = async (pred: Prediction) => {
    setSelectedPrediction(pred);
    setLoadingExplanation(true);
    setExplanation("");
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compound: pred.compoundName,
          protein: pred.proteinName,
          ragScore: pred.ragScore,
          provenance: pred.provenance,
          targetProvenance: pred.targetProvenance,
          pathways: pred.pathways
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setExplanation(data.explanation || "No assessment generated.");
      } else {
        setExplanation(data.error || "Failed to generate dynamic biological assessment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setExplanation("Unable to reach the high-performance inference server. Confirm node process is active and running.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  const closeAnalysis = () => {
    setSelectedPrediction(null);
    setExplanation("");
  };

  const downloadCSV = () => {
    const headers = ["Rank", "Compound", "Compound Registry", "Target Protein", "UniProt Mapped", "GNN Link Prob", "RAG Lit Confidence", "Status", "Bridged Pathways"];
    const rows = predictions.map((p, idx) => [
      idx + 1, 
      p.compoundName, 
      p.provenance, 
      p.proteinName, 
      p.targetProvenance, 
      p.probability.toFixed(4), 
      p.ragScore.toFixed(2), 
      p.status,
      p.pathways.join("; ")
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "biograph_hgt_repurposing_hypotheses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-xs font-semibold text-blue-400 mt-5 mb-2 border-b border-slate-800 pb-1 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={idx} className="font-semibold text-slate-200 mt-3 text-xs">{trimmed.replace(/^\*\*\s*|\s*\*\*$/g, '')}</p>;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return (
          <li key={idx} className="text-slate-300 text-xs ml-4 mb-1 list-none flex items-start gap-1">
            <span className="text-indigo-500 mt-0.5">•</span>
            <span>{trimmed.replace(/^[-*]\s*/, '')}</span>
          </li>
        );
      }
      if (trimmed) {
        return <p key={idx} className="text-slate-300 text-xs leading-relaxed mb-2.5">{trimmed}</p>;
      }
      return <div key={idx} className="h-1.5" />;
    });
  };

  const getOpenTargetsLink = (pred: Prediction) => {
    // 1. Try extracting an Ensembl or ENSG ID from the targetProvenance
    const ensgMatch = pred.targetProvenance.match(/ENSG\d+/);
    if (ensgMatch) {
      return `https://platform.opentargets.org/target/${ensgMatch[0]}`;
    }

    // 2. High-precision 2026 ground-truth Ensembl gene lookup map
    const map: Record<string, string> = {
      'AMPK': 'ENSG00000131791', // PRKAA1
      'NF-kB': 'ENSG00000109320', // NFKB1
      'NF-KB': 'ENSG00000109320',
      'Thrombospondin': 'ENSG00000137724', // THBS1
      'Rho kinase': 'ENSG00000159251', // ROCK1
      'PDE5': 'ENSG00000112139', // PDE5A
      'mTOR': 'ENSG00000198793', // MTOR
      'COX-2': 'ENSG00000073756', // PTGS2
      'MMP-9': 'ENSG00000100985', // MMP9
    };

    const nameUpper = pred.proteinName.trim();
    for (const [key, val] of Object.entries(map)) {
      if (nameUpper.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(nameUpper.toLowerCase())) {
        return `https://platform.opentargets.org/target/${val}`;
      }
    }

    // Default to search query if no mapping falls back
    return `https://platform.opentargets.org/search?q=${encodeURIComponent(pred.proteinName)}`;
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            HGT Predictive Hypotheses
            <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-0.5 rounded-full font-normal">Active Validation Block</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Ranked by Heterogeneous Graph Attention Link weights combined with molecular literature fusion.</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors text-xs font-medium"
        >
          <Download size={14} /> Export Dataset
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 flex-1 overflow-auto">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead className="bg-slate-950/70 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="p-3.5 text-slate-500 font-semibold text-2xs uppercase tracking-wider">Idx</th>
              <th className="p-3.5 text-slate-400 font-semibold text-2xs uppercase tracking-wider">Candidate Compound</th>
              <th className="p-3.5 text-slate-400 font-semibold text-2xs uppercase tracking-wider">Target Protein</th>
              <th className="p-3.5 text-slate-400 font-semibold text-2xs uppercase tracking-wider">Link Probability</th>
              <th className="p-3.5 text-slate-400 font-semibold text-2xs uppercase tracking-wider">RAG Literature Index</th>
              <th className="p-3.5 text-slate-400 font-semibold text-2xs uppercase tracking-wider">Status</th>
              <th className="p-3.5 text-slate-400 font-semibold text-2xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {predictions.map((pred, idx) => (
              <tr key={pred.id} className="hover:bg-slate-800/30 transition-colors group">
                {/* ID/Index */}
                <td className="p-3.5 text-slate-500 font-mono text-xs">{idx + 1}</td>
                
                {/* Compound & Provenance */}
                <td className="p-3.5">
                  <div className="font-medium text-slate-200 text-xs">{pred.compoundName}</div>
                  <div className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5" title="Registry provenance record">
                    <Database size={10} className="text-slate-600" />
                    {pred.provenance}
                  </div>
                </td>

                {/* Protein & Provenance */}
                <td className="p-3.5">
                  <div className="font-medium text-rose-400 text-xs">{pred.proteinName}</div>
                  <div className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5" title="Uniprot/STRING map sequence">
                    <Layers size={10} className="text-slate-600" />
                    {pred.targetProvenance}
                  </div>
                </td>

                {/* Metric: Link Probability */}
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${pred.probability * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-300 font-mono text-xs font-medium">{(pred.probability * 100).toFixed(1)}%</span>
                  </div>
                </td>

                {/* Metric: RAG Score */}
                <td className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      pred.ragScore >= 0.90 ? 'bg-emerald-500' :
                      pred.ragScore >= 0.75 ? 'bg-amber-400' : 'bg-red-400'
                    }`}></span>
                    <span className="text-slate-300 font-mono text-xs font-semibold">{(pred.ragScore * 100).toFixed(0)}%</span>
                    <span className="text-2xs text-slate-500 font-mono font-light">RAG score</span>
                  </div>
                </td>

                {/* Status Badges */}
                <td className="p-3.5">
                  <span className={`
                    px-2.5 py-0.5 rounded text-2xs font-medium border
                    ${pred.status === 'New' ? 'bg-blue-900/10 text-blue-400 border-blue-800/40' : ''}
                    ${pred.status === 'Validated' ? 'bg-emerald-900/10 text-emerald-400 border-emerald-800/40' : ''}
                    ${pred.status === 'Investigating' ? 'bg-amber-900/10 text-amber-400 border-amber-800/40' : ''}
                  `}>
                    {pred.status}
                  </span>
                </td>

                {/* Action Trigger */}
                <td className="p-3.5 text-right">
                  <button 
                    onClick={() => handleAnalyze(pred)}
                    className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 px-2.5 py-1.5 rounded-md transition-all text-xs flex items-center gap-1.5 ml-auto"
                    title="Generate Literature Grounded Assessment"
                  >
                    <Sparkles size={13} className="text-blue-400" />
                    <span>Cross-Reference</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analysis Sliding Panel */}
      {selectedPrediction && (
        <>
          {/* Backdrop screen-level overlay */}
          <div 
            onClick={closeAnalysis}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 transition-opacity cursor-pointer"
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] h-full bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl p-6 z-50 overflow-y-auto flex flex-col">
            {/* Panel Header */}
            <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-950 text-blue-400 border border-blue-900/40 rounded-lg">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">HGT Bioreasoning Agent</h3>
                  <p className="text-2xs text-slate-500 font-mono">Cross-referencing topological pathways & literatures</p>
                </div>
              </div>
              <button 
                onClick={closeAnalysis} 
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <X size={16} />
              </button>
            </div>


          <div className="space-y-5 flex-1">
            {/* Context Header Card */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-3">
              <div className="text-2xs text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-between">
                <span>Repurposing Target Candidate</span>
                <span className="bg-blue-900/30 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-3xs">
                  Active
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-md font-bold text-slate-100 justify-center bg-slate-950 py-3 rounded-lg border border-slate-900">
                <span className="text-blue-400 text-sm font-mono">{selectedPrediction.compoundName}</span>
                <span className="text-slate-600 text-xs">→</span>
                <span className="text-rose-400 text-sm font-mono">{selectedPrediction.proteinName}</span>
              </div>

              {/* Dual Confidence Gauges */}
              <div className="grid grid-cols-2 gap-2 pt-1.5 text-center">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                  <div className="text-2xs text-slate-500 font-mono">HGT LINK PROBABILITY</div>
                  <div className="text-xs font-mono font-bold text-blue-400 mt-0.5">
                    {(selectedPrediction.probability * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                  <div className="text-2xs text-slate-500 font-mono">LITERATURE RAG SCORE</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                    {(selectedPrediction.ragScore * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Mapped Pathway Network tags */}
            <div>
              <h4 className="text-2xs font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <GitFork size={12} className="text-indigo-400" />
                Interacting Pathways (Topological Hubs)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPrediction.pathways.map((path, i) => (
                  <span 
                    key={i} 
                    className="text-2xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded transition-colors"
                  >
                    {path}
                  </span>
                ))}
              </div>
            </div>

            {/* Inferred Graph Attention profiles */}
            <div>
              <h4 className="text-2xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={12} className="text-indigo-400" />
                HGT Multi-Head Self-Attention Mapping
              </h4>
              <div className="space-y-2 bg-slate-900/40 border border-slate-800 p-3 rounded-lg">
                {selectedPrediction.attentionWeights.map((att, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-2xs font-mono">
                      <span className="text-slate-400 text-3xs font-sans">{att.node}</span>
                      <span className="text-indigo-400 font-light font-sans">attn weight: {att.weight.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${att.weight * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <span className="text-3xs text-slate-600 block mt-1.5 font-sans italic">Weights represent relative message importance across Heterogeneous Link Attention layers.</span>
              </div>
            </div>

            {/* Dynamic AI Literature Synthesis */}
            <div className="space-y-2 flex-1">
              <h4 className="text-2xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={12} className="text-blue-400" />
                Evidence-Grounded Mechanistic Analysis
              </h4>
              <div className="text-slate-300 bg-slate-900/60 rounded-xl border border-slate-800 p-4 min-h-[160px] leading-relaxed">
                {loadingExplanation ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-400 font-sans tracking-wide">Assembling pathway citations & synthesis...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {renderMarkdown(explanation)}
                  </div>
                )}
              </div>
            </div>

            {/* External Groundings */}
            <div className="pt-4 border-t border-slate-900 flex gap-2">
              <a 
                href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(selectedPrediction.compoundName + "+" + selectedPrediction.proteinName)}`}
                target="_blank" 
                referrerPolicy="no-referrer"
                className="w-1/2 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <PubIcon size={13} />
                Search PubMed
              </a>
              <a 
                href={getOpenTargetsLink(selectedPrediction)}
                target="_blank" 
                referrerPolicy="no-referrer"
                className="w-1/2 py-2 bg-blue-900/10 hover:bg-blue-900/20 border border-blue-900/30 hover:border-blue-900/50 text-blue-400 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Microscope size={13} />
                OpenTargets profile
              </a>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default PredictionTable;
