import React, { useState } from 'react';
import { Prediction } from '../types';
import { 
  Download, 
  Sparkles, 
  Microscope, 
  X, 
  BookOpen, 
  Layers, 
  GitFork, 
  Database,
  Network,
  Info,
  ExternalLink
} from 'lucide-react';

interface PredictionTableProps {
  predictions: Prediction[];
  onViewGraph?: () => void;
}

const PredictionTable: React.FC<PredictionTableProps> = ({ predictions, onViewGraph }) => {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const handleAnalyze = async (pred: Prediction) => {
    setSelectedPrediction(pred);
    setLoadingExplanation(true);
    setExplanation("");
    try {
      const customKey = localStorage.getItem("user_gemini_api_key") || "";
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-key": customKey
        },
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
    const headers = ["Compound", "Compound Registry", "Target Protein", "UniProt Mapped", "GNN Link Prob", "RAG Lit Confidence", "Status", "Bridged Pathways"];
    const rows = predictions.map((p) => [
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
          <h4 key={idx} className="text-xs font-semibold text-indigo-400 mt-5 mb-2 border-b border-slate-800 pb-1 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
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
            <span className="text-indigo-400 mt-0.5">•</span>
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
    const ensgMatch = pred.targetProvenance.match(/ENSG\d+/);
    if (ensgMatch) {
      return `https://platform.opentargets.org/target/${ensgMatch[0]}`;
    }

    const map: Record<string, string> = {
      'AMPK': 'ENSG00000131791',
      'NF-kB': 'ENSG00000109320',
      'NF-KB': 'ENSG00000109320',
      'Thrombospondin': 'ENSG00000137724',
      'Rho kinase': 'ENSG00000159251',
      'PDE5': 'ENSG00000112139',
      'mTOR': 'ENSG00000198793',
      'COX-2': 'ENSG00000073756',
      'MMP-9': 'ENSG00000100985',
    };

    const nameUpper = pred.proteinName.trim();
    for (const [key, val] of Object.entries(map)) {
      if (nameUpper.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(nameUpper.toLowerCase())) {
        return `https://platform.opentargets.org/target/${val}`;
      }
    }

    return `https://platform.opentargets.org/search?q=${encodeURIComponent(pred.proteinName)}`;
  };

  const renderDots = (score: number) => {
    const dotsCount = Math.max(1, Math.min(5, Math.round(score * 5)));
    return (
      <div className="flex gap-1" title={`Evidence Confidence: ${(score * 100).toFixed(0)}%`}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i < dotsCount ? 'bg-indigo-500 shadow-sm shadow-indigo-550' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    );
  };

  const getProbabilityColor = (prob: number) => {
    const val = prob * 100;
    if (val >= 90) return 'text-emerald-400 font-bold';
    if (val >= 80) return 'text-amber-400 font-bold';
    return 'text-rose-500 font-bold';
  };

  return (
    <div className="flex flex-col h-full relative" id="predictions-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6" id="predictions-header">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            Inferred Hypotheses
            <span className="text-3xs bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full font-normal">Active Pipeline Workspace</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Ranked by Heterogeneous Graph Attention Link weights combined with molecular literature fusion.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto" id="predictions-actions">
          {onViewGraph && (
            <button
              onClick={onViewGraph}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs rounded-lg transition-all font-semibold shadow-md shadow-indigo-900/30 cursor-pointer"
              title="Expand focused knowledge graph workspace"
              id="btn-view-graph"
            >
              <Network size={14} />
              <span>View Graph</span>
            </button>
          )}
          <button 
            onClick={downloadCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-slate-200 rounded-lg border border-slate-800 transition-colors text-xs font-semibold cursor-pointer"
            id="btn-export-csv"
          >
            <Download size={14} /> 
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/70 rounded-xl border border-slate-850 flex-1 overflow-auto" id="table-container">
        <table className="w-full min-w-[600px] text-left border-collapse" id="hypotheses-table">
          <thead className="bg-slate-950/70 border-b border-slate-850 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="p-4 text-slate-400 font-semibold text-2xs uppercase tracking-wider">Candidate Compound</th>
              <th className="p-4 text-slate-400 font-semibold text-2xs uppercase tracking-wider">Target Protein</th>
              <th className="p-4 text-slate-400 font-semibold text-2xs uppercase tracking-wider">Link Probability</th>
              <th className="p-4 text-slate-400 font-semibold text-2xs uppercase tracking-wider">Evidence Score</th>
              <th className="p-4 text-slate-400 font-semibold text-2xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {predictions.length > 0 ? (
              predictions.map((pred) => (
                <tr key={pred.id} className="hover:bg-slate-855/35 transition-colors group">
                  {/* Compound Block with tooltip */}
                  <td className="p-4">
                    <div className="relative group/tooltip inline-block">
                      <div className="font-semibold text-slate-200 text-xs border-b border-dashed border-slate-700 hover:border-slate-400 cursor-help transition-colors">
                        {pred.compoundName}
                      </div>
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:flex flex-col bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-3xs text-slate-300 font-mono shadow-2xl z-50 pointer-events-none min-w-[200px]" id={`tooltip-cmp-${pred.id}`}>
                        <div className="text-slate-500 font-bold uppercase tracking-wider text-4xs">Registry Record</div>
                        <div className="text-indigo-400 font-semibold mt-0.5">{pred.provenance}</div>
                        <div className="text-slate-600 mt-1 italic text-4xs leading-normal">
                          Molecular graph entry point ChEMBL/DrugBank mapping signature.
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Protein Symbol with tooltip */}
                  <td className="p-4">
                    <div className="relative group/tooltip inline-block">
                      <div className="font-semibold text-slate-205 text-xs text-indigo-400 border-b border-dashed border-indigo-900 hover:border-indigo-500 cursor-help transition-colors">
                        {pred.proteinName}
                      </div>
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:flex flex-col bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-3xs text-slate-300 font-mono shadow-2xl z-50 pointer-events-none min-w-[240px]" id={`tooltip-prot-${pred.id}`}>
                        <div className="text-slate-500 font-bold uppercase tracking-wider text-4xs">Mapped Ensembl Target</div>
                        <div className="text-emerald-400 font-semibold mt-0.5">{pred.targetProvenance}</div>
                        <div className="text-slate-600 mt-1 italic text-4xs leading-normal">
                          Functional genomic validation ID and protein association profile.
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* GNN Probability Numbers Only */}
                  <td className="p-4 font-mono text-xs">
                    <span className={getProbabilityColor(pred.probability)}>
                      {(pred.probability * 100).toFixed(1)}%
                    </span>
                  </td>

                  {/* Evidence Score dots only */}
                  <td className="p-4">
                    {renderDots(pred.ragScore)}
                  </td>

                  {/* Compact action trigger */}
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleAnalyze(pred)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/40 hover:bg-indigo-600/10 text-indigo-400 font-semibold hover:text-indigo-300 border border-indigo-950 hover:border-indigo-500/30 rounded-lg transition-all text-2xs cursor-pointer"
                      title="Cross-reference literature index parameters"
                      id={`btn-cross-${pred.id}`}
                    >
                      <Sparkles size={11} className="text-indigo-500" />
                      <span>Cross-Reference</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs text-slate-500 font-mono">
                  No candidate repurposing hypotheses match current threshold rules or searches.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Analysis Sliding Panel */}
      {selectedPrediction && (
        <>
          <div 
            onClick={closeAnalysis}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 transition-opacity cursor-pointer"
            id="analysis-backdrop"
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] h-full bg-slate-950/95 backdrop-blur-xl border-l border-slate-850 shadow-2xl p-6 z-50 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-250" id="analysis-sidebar">
            {/* Panel Header */}
            <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-950/80 text-indigo-400 border border-indigo-900/40 rounded-lg">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">HGT Bioreasoning Agent</h3>
                  <p className="text-4xs text-slate-500 font-mono">Cross-referencing topological pathways & literatures</p>
                </div>
              </div>
              <button 
                onClick={closeAnalysis} 
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded transition-colors cursor-pointer"
                aria-label="Close panel"
                id="btn-close-analysis"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {/* Context Header Card */}
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-850 space-y-3">
                <div className="text-4xs text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-between">
                  <span>Repurposing Target Candidate</span>
                  <span className="bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded text-3xs font-mono">
                    PROBABLE CANDIDATE
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm font-bold text-slate-100 justify-center bg-slate-950 py-3 rounded-lg border border-slate-850">
                  <span className="text-indigo-400 text-sm font-mono">{selectedPrediction.compoundName}</span>
                  <span className="text-slate-600 text-xs">→</span>
                  <span className="text-indigo-400 text-sm font-mono">{selectedPrediction.proteinName}</span>
                </div>

                {/* Dual Confidence Gauges */}
                <div className="grid grid-cols-2 gap-2 pt-1.5 text-center font-mono">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850/50">
                    <div className="text-4xs text-slate-500">HGT LINK PROBABILITY</div>
                    <div className="text-xs font-bold text-indigo-400 mt-0.5">
                      {(selectedPrediction.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850/50">
                    <div className="text-4xs text-slate-500">LITERATURE CONFIDENCE</div>
                    <div className="text-xs font-bold text-indigo-400 mt-0.5">
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
                      className="text-2xs font-medium text-slate-300 bg-slate-900 border border-slate-850 px-2.5 py-1 rounded transition-colors"
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
                <div className="space-y-2 bg-slate-900/30 border border-slate-850 p-3 rounded-lg">
                  {selectedPrediction.attentionWeights.map((att, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-2xs font-mono">
                        <span className="text-slate-400 text-3xs">{att.node}</span>
                        <span className="text-indigo-400 font-light text-3xs">attn weight: {att.weight.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${att.weight * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <span className="text-4xs text-slate-600 block mt-1.5 italic font-sans">
                    Weights represent relative message importance across Heterogeneous Link Attention layers.
                  </span>
                </div>
              </div>

              {/* Dynamic AI Literature Synthesis */}
              <div className="space-y-2 flex-1">
                <h4 className="text-2xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={12} className="text-indigo-400" />
                  Evidence-Grounded Mechanistic Analysis
                </h4>
                <div className="text-slate-300 bg-slate-900/45 rounded-xl border border-slate-855 p-4 min-h-[160px] leading-relaxed">
                  {loadingExplanation ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                      <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <span className="text-xs text-slate-400 tracking-wide font-mono">Assembling pathway citations & synthesis...</span>
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
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="w-1/2 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <ExternalLink size={13} />
                  Search PubMed
                </a>
                <a 
                  href={getOpenTargetsLink(selectedPrediction)}
                  target="_blank"
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="w-1/2 py-2 bg-indigo-950/40 hover:bg-indigo-950/60 border border-indigo-900/30 hover:border-indigo-900/50 text-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
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
