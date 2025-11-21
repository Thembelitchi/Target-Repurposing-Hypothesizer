import React, { useState } from 'react';
import { AppView, GraphData, Prediction } from './types';
import GraphVisualizer from './components/GraphVisualizer';
import TrainingMonitor from './components/TrainingMonitor';
import PredictionTable from './components/PredictionTable';
import DataUpload from './components/DataUpload';
import { INITIAL_GRAPH_DATA, PREDICTIONS_DATA, TRAINING_METRICS } from './services/mockData';
import { 
  LayoutDashboard, 
  Network, 
  BrainCircuit, 
  ListOrdered, 
  FlaskConical,
  Github,
  Database
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [graphData, setGraphData] = useState<GraphData>(INITIAL_GRAPH_DATA);
  const [predictions, setPredictions] = useState<Prediction[]>(PREDICTIONS_DATA);
  const [isCustomData, setIsCustomData] = useState(false);

  const handleDataLoaded = (newGraph: GraphData, newPredictions: Prediction[]) => {
    setGraphData(newGraph);
    setPredictions(newPredictions);
    setIsCustomData(true);
    setCurrentView(AppView.DASHBOARD); // Redirect to dashboard to see results
  };

  const resetData = () => {
    setGraphData(INITIAL_GRAPH_DATA);
    setPredictions(PREDICTIONS_DATA);
    setIsCustomData(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto p-1">
            <div className="flex flex-col gap-6 h-full">
                <div className="h-[400px] lg:h-1/2 relative">
                    <h3 className="text-slate-300 font-semibold mb-3 flex items-center gap-2 justify-between">
                        <span className="flex items-center gap-2"><Network size={18} /> Graph Topology</span>
                        {isCustomData && <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800">Custom Data Active</span>}
                    </h3>
                    <GraphVisualizer data={graphData} />
                </div>
                <div className="h-[400px] lg:h-1/2">
                    <TrainingMonitor data={TRAINING_METRICS} />
                </div>
            </div>
            <div className="h-full min-h-[500px]">
               <PredictionTable predictions={predictions} />
            </div>
          </div>
        );
      case AppView.GRAPH_EXPLORER:
        return (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-100">Heterogeneous Graph Explorer</h2>
              {isCustomData && (
                <button onClick={resetData} className="text-xs text-rose-400 hover:text-rose-300 underline">
                  Reset to Demo Data
                </button>
              )}
            </div>
            <div className="flex-1">
              <GraphVisualizer data={graphData} />
            </div>
          </div>
        );
      case AppView.TRAINING:
        return (
          <div className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="flex-1 py-6">
               <TrainingMonitor data={TRAINING_METRICS} />
            </div>
          </div>
        );
      case AppView.PREDICTIONS:
        return (
          <div className="h-full flex flex-col">
             <div className="flex-1">
                <PredictionTable predictions={predictions} />
             </div>
          </div>
        );
      case AppView.DATA_UPLOAD:
        return (
          <DataUpload onDataLoaded={handleDataLoaded} />
        );
      default:
        return <div>Select a view</div>;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        currentView === view
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-blue-500 mb-1">
            <FlaskConical size={28} />
            <span className="font-bold text-lg tracking-tight text-slate-100">BioGraph<span className="text-blue-500">AI</span></span>
          </div>
          <p className="text-xs text-slate-500">Target Repurposing Suite</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Overview" />
          <NavItem view={AppView.GRAPH_EXPLORER} icon={Network} label="Graph Explorer" />
          <NavItem view={AppView.TRAINING} icon={BrainCircuit} label="Model Training" />
          <NavItem view={AppView.PREDICTIONS} icon={ListOrdered} label="Hypotheses" />
          <div className="pt-4 mt-4 border-t border-slate-800">
             <NavItem view={AppView.DATA_UPLOAD} icon={Database} label="Upload Data" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Model Stats</h4>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Nodes</span>
              <span className="text-slate-300">{graphData.nodes.length.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Edges</span>
              <span className="text-slate-300">{graphData.links.length.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">AUROC</span>
              <span className="text-emerald-400 font-bold">0.884</span>
            </div>
          </div>
           <a href="#" className="flex items-center gap-2 text-xs text-slate-500 mt-4 hover:text-slate-300 justify-center">
             <Github size={14} /> View gnn_repurpose.py
           </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-8">
            <h1 className="text-lg font-medium text-slate-200">
              {currentView === AppView.DASHBOARD && 'Executive Dashboard'}
              {currentView === AppView.GRAPH_EXPLORER && 'Knowledge Graph Inspection'}
              {currentView === AppView.TRAINING && 'GNN Training Monitor'}
              {currentView === AppView.PREDICTIONS && 'Hypothesis Generation'}
              {currentView === AppView.DATA_UPLOAD && 'Data Ingestion Pipeline'}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                 <span className={`w-2 h-2 rounded-full ${isCustomData ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                 {isCustomData ? 'Custom Session' : 'System Ready'}
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-indigo-400">
                JD
              </div>
            </div>
        </header>
        <div className="flex-1 p-6 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
