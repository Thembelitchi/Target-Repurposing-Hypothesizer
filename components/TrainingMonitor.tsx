import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrainingMetric } from '../types';
import { Play, Pause, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TrainingMonitorProps {
  data: TrainingMetric[];
}

const TrainingMonitor: React.FC<TrainingMonitorProps> = ({ data }) => {
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [displayedData, setDisplayedData] = useState<TrainingMetric[]>([]);

  useEffect(() => {
    if (isTraining && currentEpoch < data.length) {
      const timer = setTimeout(() => {
        setDisplayedData(prev => [...prev, data[currentEpoch]]);
        setCurrentEpoch(prev => prev + 1);
      }, 100); // Simulation speed
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

  const progress = (currentEpoch / data.length) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">GNN Model Training</h2>
          <p className="text-slate-400 text-sm">GraphSAGE Encoder-Decoder Optimization</p>
        </div>
        <div className="flex gap-2">
          {!isTraining && currentEpoch < data.length && (
            <button onClick={startTraining} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Play size={16} /> Start
            </button>
          )}
          {isTraining && (
            <button onClick={pauseTraining} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
              <Pause size={16} /> Pause
            </button>
          )}
          <button onClick={reset} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Current Epoch</p>
          <p className="text-2xl font-mono text-slate-200 mt-1">{currentEpoch} <span className="text-slate-500 text-base">/ {data.length}</span></p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Current Loss</p>
          <p className="text-2xl font-mono text-rose-400 mt-1">
            {displayedData.length > 0 ? displayedData[displayedData.length - 1].loss.toFixed(4) : '0.0000'}
          </p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Val AUROC</p>
          <p className="text-2xl font-mono text-emerald-400 mt-1">
            {displayedData.length > 0 ? displayedData[displayedData.length - 1].auroc.toFixed(4) : '0.0000'}
          </p>
        </div>
      </div>
      
      {currentEpoch === data.length && (
         <div className="mb-4 p-3 bg-emerald-900/20 border border-emerald-800 rounded text-emerald-400 flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} /> Target Performance Reached: AUROC {'>'} 0.85
         </div>
      )}

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="epoch" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[0, 2.5]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Line type="monotone" dataKey="loss" stroke="#f43f5e" strokeWidth={2} dot={false} name="Loss (BCE)" animationDuration={0} />
            <Line type="monotone" dataKey="auroc" stroke="#10b981" strokeWidth={2} dot={false} name="AUROC" animationDuration={0} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrainingMonitor;
