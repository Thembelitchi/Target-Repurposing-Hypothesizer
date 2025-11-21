import React, { useState } from 'react';
import { Prediction } from '../types';
import { Download, Sparkles, Microscope, ExternalLink, X } from 'lucide-react';
import { explainHypothesis } from '../services/geminiService';

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
    const result = await explainHypothesis(pred.compoundName, pred.proteinName);
    setExplanation(result);
    setLoadingExplanation(false);
  };

  const closeAnalysis = () => {
    setSelectedPrediction(null);
    setExplanation("");
  };

  const downloadCSV = () => {
    const headers = ["Compound ID", "Compound Name", "Protein ID", "Protein Name", "Probability", "Status"];
    const rows = predictions.map(p => [p.compoundId, p.compoundName, p.proteinId, p.proteinName, p.probability.toFixed(4), p.status]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "target_repurposing_hypotheses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Top Hypotheses</h2>
          <p className="text-slate-400 text-sm">Ranked by link probability score</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/50 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Rank</th>
              <th className="p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Compound</th>
              <th className="p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Target Protein</th>
              <th className="p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Probability</th>
              <th className="p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
              <th className="p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {predictions.map((pred, idx) => (
              <tr key={pred.id} className="hover:bg-slate-700/30 transition-colors group">
                <td className="p-4 text-slate-500 font-mono text-sm">{idx + 1}</td>
                <td className="p-4 font-medium text-blue-400">{pred.compoundName}</td>
                <td className="p-4 font-medium text-rose-400">{pred.proteinName}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${pred.probability * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-300 text-sm font-mono">{pred.probability.toFixed(3)}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium border
                    ${pred.status === 'New' ? 'bg-blue-900/30 text-blue-400 border-blue-800' : ''}
                    ${pred.status === 'Validated' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : ''}
                    ${pred.status === 'Investigating' ? 'bg-amber-900/30 text-amber-400 border-amber-800' : ''}
                  `}>
                    {pred.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleAnalyze(pred)}
                    className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 p-2 rounded-lg transition-all opacity-80 hover:opacity-100"
                    title="Analyze with AI"
                  >
                    <Sparkles size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analysis Modal/Panel */}
      {selectedPrediction && (
        <div className="absolute top-0 right-0 w-full md:w-96 h-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl p-6 transform transition-transform duration-300 ease-in-out z-20">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={20} />
              <h3 className="font-bold text-lg">AI Analysis</h3>
            </div>
            <button onClick={closeAnalysis} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Hypothesis</span>
                <span className="text-emerald-400 font-mono text-sm">{(selectedPrediction.probability * 100).toFixed(1)}% Probable</span>
              </div>
              <div className="flex items-center gap-3 text-lg font-medium text-slate-200">
                <span className="text-blue-400">{selectedPrediction.compoundName}</span>
                <span className="text-slate-500">→</span>
                <span className="text-rose-400">{selectedPrediction.proteinName}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Microscope size={14} /> Mechanism Plausibility
              </h4>
              <div className="text-sm text-slate-400 leading-relaxed p-3 bg-slate-800 rounded border border-slate-700/50 min-h-[100px]">
                {loadingExplanation ? (
                  <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                    <span>Analyzing biological pathways...</span>
                  </div>
                ) : (
                  explanation
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
                <ExternalLink size={16} />
                Search PubMed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionTable;
