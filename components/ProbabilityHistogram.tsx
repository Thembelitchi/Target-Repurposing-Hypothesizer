import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Prediction } from '../types';
import { BarChart3, Info } from 'lucide-react';

interface ProbabilityHistogramProps {
  predictions: Prediction[];
}

const ProbabilityHistogram: React.FC<ProbabilityHistogramProps> = ({ predictions }) => {
  const chartData = useMemo(() => {
    // Construct 10 bins of size 0.1
    const bins = [
      { name: '0.0-0.1', count: 0, range: [0.0, 0.1], color: '#334155' },
      { name: '0.1-0.2', count: 0, range: [0.1, 0.2], color: '#334155' },
      { name: '0.2-0.3', count: 0, range: [0.2, 0.3], color: '#475569' },
      { name: '0.3-0.4', count: 0, range: [0.3, 0.4], color: '#4d5c7c' },
      { name: '0.4-0.5', count: 0, range: [0.4, 0.5], color: '#6366f1' },
      { name: '0.5-0.6', count: 0, range: [0.5, 0.6], color: '#7c3aed' },
      { name: '0.6-0.7', count: 0, range: [0.6, 0.7], color: '#818cf8' },
      { name: '0.7-0.8', count: 0, range: [0.7, 0.8], color: '#4f46e5' },
      { name: '0.8-0.9', count: 0, range: [0.8, 0.9], color: '#3730a3' },
      { name: '0.9-1.0', count: 0, range: [0.9, 1.01], color: '#10b981' },
    ];

    predictions.forEach(p => {
      const prob = p.probability;
      for (let i = 0; i < bins.length; i++) {
        const [min, max] = bins[i].range;
        if (prob >= min && prob < max) {
          bins[i].count += 1;
          break;
        }
      }
    });

    return bins;
  }, [predictions]);

  // Compute peak count for descriptive sizing or status logs
  const peakCountStatus = useMemo(() => {
    let maxBin = bins => {
      let maxVal = -1;
      let maxName = 'N/A';
      bins.forEach(b => {
        if (b.count > maxVal) {
          maxVal = b.count;
          maxName = b.name;
        }
      });
      return { val: maxVal, name: maxName };
    };
    return maxBin(chartData);
  }, [chartData]);

  // Check custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-4xs font-mono shadow-2xl">
          <p className="text-slate-400 font-bold uppercase tracking-wider">Interval: {data.name}</p>
          <p className="text-indigo-400 font-bold mt-1 text-3xs">
            Leads Count: <span className="text-slate-100">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full gap-4 bg-slate-900 border border-slate-850 rounded-xl p-5 animate-in fade-in duration-250" id="predictions-histogram-card">
      <div className="flex justify-between items-center pb-2 border-b border-slate-850/40">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono uppercase">
            <BarChart3 size={14} className="text-indigo-400 shrink-0" />
            <span>Probability Landscape</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Distribution frequency of predicted link validation edges.</p>
        </div>
        <span className="text-[9px] font-mono leading-none bg-slate-950/80 text-indigo-400 border border-indigo-950 px-2 py-1 rounded">
          {predictions.length} Binned
        </span>
      </div>

      {predictions.length > 0 ? (
        <>
          {/* Main Distribution Chart Area */}
          <div className="flex-1 w-full min-h-[160px] h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#576f8a" 
                  tickLine={false}
                  axisLine={{ stroke: '#1e293b' }}
                  style={{ fontSize: '9px', fontFamily: 'monospace' }} 
                />
                <YAxis 
                  stroke="#576f8a" 
                  tickLine={false}
                  axisLine={{ stroke: '#1e293b' }}
                  tickCount={5}
                  allowDecimals={false}
                  style={{ fontSize: '9px', fontFamily: 'monospace' }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#0f172a', opacity: 0.3 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Auxiliary statistics summary */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between text-4xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Info size={11} className="text-slate-600 shrink-0" />
              <span>Modal Frequency Group:</span>
              <strong className="text-indigo-400 font-bold">{peakCountStatus.name}</strong>
            </div>
            <div className="text-slate-400">
              Peak: <strong className="text-indigo-400 font-bold">{peakCountStatus.val}</strong> leads
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-10 font-mono text-center text-slate-500 text-4xs leading-relaxed">
          <span>No predictive data points matched corresponding search configurations.</span>
        </div>
      )}
    </div>
  );
};

export default ProbabilityHistogram;
