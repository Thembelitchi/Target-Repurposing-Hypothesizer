import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrainingMetric } from '../types';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  Activity, 
  Globe, 
  CheckCircle,
  Sparkles,
  X
} from 'lucide-react';

interface TrainingMonitorProps {
  data: TrainingMetric[];
}

const TrainingMonitor: React.FC<TrainingMonitorProps> = ({ data }) => {
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [displayedData, setDisplayedData] = useState<TrainingMetric[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [loadingExplanation, setLoadingExplanation] = useState<boolean>(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);

  const handleExplainTraining = async () => {
    setShowAnalysisModal(true);
    if (explanation) return;
    setLoadingExplanation(true);
    try {
      const customKey = localStorage.getItem("user_gemini_api_key") || "";
      const response = await fetch("/api/explain-training", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-key": customKey
        },
      });
      const resData = await response.json();
      if (response.ok) {
        setExplanation(resData.explanation || "No explanation report generated.");
      } else {
        setExplanation(resData.error || "Failed to generate AI-grounded training explanation. Ensure configuration is verified.");
      }
    } catch (err) {
      console.error(err);
      setExplanation("Unable to reach the high-performance inference server. Confirm server processes are fully active.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-xs font-semibold text-indigo-400 mt-5 mb-2 border-b border-slate-800 pb-1 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-505"></span>
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={idx} className="font-semibold text-slate-205 mt-3 text-xs">{trimmed.replace(/^\*\*\s*|\s*\*\*$/g, '')}</p>;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return (
          <li key={idx} className="text-slate-300 text-xs ml-4 mb-2 list-none flex items-start gap-1 font-sans leading-relaxed">
            <span className="text-indigo-400 mt-1 shrink-0 text-3xs">•</span>
            <span>{trimmed.replace(/^[-*]\s*/, '')}</span>
          </li>
        );
      }
      if (trimmed) {
        return <p key={idx} className="text-slate-350 text-xs leading-relaxed mb-2.5 font-sans">{trimmed}</p>;
      }
      return <div key={idx} className="h-1.5" />;
    });
  };

  useEffect(() => {
    if (isTraining && currentEpoch < data.length) {
      const timer = setTimeout(() => {
        setDisplayedData(prev => [...prev, data[currentEpoch]]);
        setCurrentEpoch(prev => prev + 1);
      }, 70);
      return () => clearTimeout(timer);
    } else if (currentEpoch >= data.length) {
      setIsTraining(false);
    }
  }, [isTraining, currentEpoch, data]);

  const startTraining = () => {
    if (currentEpoch >= data.length) {
      setDisplayedData([]);
      setCurrentEpoch(0);
    }
    setIsTraining(true);
  };

  const pauseTraining = () => setIsTraining(false);

  const reset = () => {
    setIsTraining(false);
    setCurrentEpoch(0);
    setDisplayedData([]);
  };

  const isReady = currentEpoch === 0 && !isTraining;
  const isCompleted = currentEpoch >= data.length && !isTraining;
  const isOngoing = isTraining || (currentEpoch > 0 && currentEpoch < data.length);

  if (isReady) {
    return (
      <div className="flex items-center justify-between bg-slate-900 border border-slate-850 px-4 py-3 rounded-xl shadow-lg animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-xs font-mono font-medium text-slate-300">HGT Optimization Engine: Model Ready</span>
        </div>
        <button 
          onClick={startTraining}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-550 active:scale-95 text-white text-3xs font-mono uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
          id="btn-optimize-ready"
        >
          <Play size={10} fill="currentColor" />
          <span>Optimize</span>
        </button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 border border-slate-850 px-4 py-3 rounded-xl shadow-lg animate-in fade-in duration-200" id="training-summary-bar">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-indigo-400" />
          <div className="font-mono text-xs flex gap-2 items-center text-slate-300">
            <span className="text-slate-200 font-bold uppercase">AUROC: 0.9450</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Last trained: 2h ago</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExplainTraining}
            className="inline-flex items-center gap-1.5 text-3xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider bg-indigo-950/40 border border-indigo-900/30 px-2.5 py-1.5 rounded-lg hover:border-indigo-500/50 transition-all cursor-pointer"
          >
            <Sparkles size={11} className="text-indigo-400 animate-pulse" />
            <span>Explain Findings</span>
          </button>
          <button
            onClick={reset}
            className="text-3xs text-slate-500 hover:text-slate-300 font-bold uppercase transition-colors px-2 py-1.5 cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Training Analysis drawer inside modal */}
        {showAnalysisModal && (
          <>
            <div 
              onClick={() => setShowAnalysisModal(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-40 transition-opacity cursor-pointer"
            />
            <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] h-full bg-slate-950 border-l border-slate-850 shadow-2xl p-6 z-50 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-250">
              <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-950 text-indigo-400 border border-indigo-900/40 rounded-lg">
                    <Sparkles size={16} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider font-mono">HGT Optimization Analyst</h3>
                    <p className="text-4xs text-slate-500 font-mono">Evaluating BCE loss and target validation links</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAnalysisModal(false)} 
                  className="p-1.5 text-slate-450 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                  aria-label="Close panel"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <span className="text-4xs uppercase text-indigo-400 font-bold font-mono tracking-widest block">Core Epoch Convergence</span>
                  <div className="grid grid-cols-2 gap-2 text-3xs font-mono">
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-850">
                      <span className="text-slate-500 block">Final Loss</span>
                      <strong className="text-rose-400 text-2xs">0.1482</strong>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-850">
                      <span className="text-slate-500 block">Peak AUROC</span>
                      <strong className="text-emerald-400 text-2xs">0.9450</strong>
                    </div>
                  </div>
                </div>

                <div className="text-slate-300 bg-slate-900/40 rounded-xl border border-slate-850 p-4.5 min-h-[220px] leading-relaxed">
                  {loadingExplanation ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                      <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <span className="text-xs text-slate-400 font-sans tracking-wide">Deconstructing hyperparameter logs & attention matrices...</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {renderMarkdown(explanation)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-5 pt-3 border-t border-slate-850/80 flex">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-center"
                >
                  Close Report
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-5 bg-slate-900 border border-slate-850 rounded-xl p-5 animate-in fade-in duration-250" id="active-training-box">
      <div className="flex justify-between items-center pb-2 border-b border-slate-850/40">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono uppercase">
            HGT + BioGPT Optimization Engine
            <span className="text-4xs font-mono font-bold bg-indigo-950/60 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded-full animate-pulse">Running</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Real-time GNN Transformer loss convergence of target linkage probabilities.</p>
        </div>
        <div className="flex gap-1.5">
          {isTraining ? (
            <button 
              onClick={pauseTraining} 
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-3xs font-mono uppercase font-bold rounded transition-colors cursor-pointer"
            >
              <Pause size={10} /> Pause
            </button>
          ) : (
            <button 
              onClick={startTraining} 
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-3xs font-mono uppercase font-bold rounded transition-colors cursor-pointer"
            >
              <Play size={10} /> Resume
            </button>
          )}
          <button 
            onClick={reset} 
            className="p-1 px-2 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Reset Epoch Progression"
          >
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-center font-mono">
          <p className="text-slate-500 text-4xs uppercase tracking-wider font-semibold">Epoch Status</p>
          <p className="text-slate-200 font-bold mt-1 text-sm">
            {currentEpoch} <span className="text-slate-650 text-xs">/ {data.length}</span>
          </p>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-center font-mono">
          <p className="text-slate-500 text-4xs uppercase tracking-wider font-semibold">BCE Loss</p>
          <p className="text-rose-400 font-bold mt-1 text-sm">
            {displayedData.length > 0 ? displayedData[displayedData.length - 1].loss.toFixed(4) : '2.5000'}
          </p>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-center font-mono">
          <p className="text-slate-500 text-4xs uppercase tracking-wider font-semibold">Validated AUROC</p>
          <p className="text-emerald-400 font-bold mt-1 text-sm">
            {displayedData.length > 0 ? displayedData[displayedData.length - 1].auroc.toFixed(4) : '0.5000'}
          </p>
        </div>
      </div>

      {/* Embedded convergence line chart */}
      <div className="flex-1 w-full min-h-[160px] h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayedData} margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="epoch" stroke="#64748b" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '9px', fontFamily: 'monospace' }} domain={[0, 2.5]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#cbd5e1', fontSize: '10px' }}
              itemStyle={{ color: '#cbd5e1' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
            <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Loss (BCE)" animationDuration={0} />
            <Line type="monotone" dataKey="auroc" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Validated AUROC" animationDuration={0} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrainingMonitor;
