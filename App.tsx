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
  Database,
  Compass,
  Cpu,
  Sparkles,
  GitMerge,
  BarChart4,
  Menu,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [graphData, setGraphData] = useState<GraphData>(INITIAL_GRAPH_DATA);
  const [predictions, setPredictions] = useState<Prediction[]>(PREDICTIONS_DATA);
  const [isCustomData, setIsCustomData] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className="flex flex-col gap-8 h-full overflow-y-auto pr-1 pb-12">
            {/* Row 1: Workspace Grid (Knowledge Graph & Predictions Card) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Graph View (7 cols) */}
              <div className="lg:col-span-7 h-[460px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-slate-300 text-xs font-semibold mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono tracking-wider"><Network size={14} className="text-blue-400" /> KNOWLEDGE GRAPH TOPOLOGY (HGT EMBEDDING PLANE)</span>
                  {isCustomData ? (
                    <span className="text-3xs text-blue-400 bg-blue-950/40 px-2.5 py-0.5 rounded border border-blue-900 font-semibold tracking-wide uppercase font-mono">Custom Pipeline Active</span>
                  ) : (
                    <span className="text-3xs text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-900 font-semibold tracking-wide uppercase font-mono">Reference Ground Truth</span>
                  )}
                </h3>
                <div className="flex-1 min-h-0 relative">
                  <GraphVisualizer data={graphData} />
                </div>
              </div>

              {/* Right Column: Predictive Hypotheses (5 cols) */}
              <div className="lg:col-span-5 h-[460px] flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl p-4 overflow-hidden">
                <PredictionTable predictions={predictions} />
              </div>
            </div>

            {/* Row 2: Optimization Telemetry (Full Width for high-precision plotting) */}
            <div className="h-auto xl:h-[480px] bg-slate-900/10">
              <TrainingMonitor data={TRAINING_METRICS} />
            </div>

            {/* Row 3: Competitive Positioning Panel (Criticism #4) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-widest">
                    <Compass size={14} className="text-indigo-400" />
                    2026 Competitive landscape & Positioning Matrix
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Strategic comparison of systems drug-repurposing pipelines. Why major pharma partners select BioGraphAI.</p>
                </div>
                <div className="text-3xs bg-slate-950 text-indigo-400 border border-indigo-900/40 px-2.5 py-1 rounded-full font-mono">
                  Benchmark v4.1 (Dec 2026)
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* BioGraphAI */}
                <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900 border-2 border-indigo-500/40 p-4 rounded-xl space-y-2 relative">
                  <span className="absolute top-3 right-3 text-3xs font-mono bg-indigo-500 text-white px-2 py-0.5 rounded uppercase tracking-widest font-semibold">OUR ENGINE</span>
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">BioGraphAI</h4>
                  <p className="text-slate-400 text-2xs leading-relaxed">
                    <strong>HGT + BioGPT-4 Fusion:</strong> Fuses physical pathway maps with structured multi-head self-attention, generating precise target linkage probabilities and literature RAG score verification.
                  </p>
                  <div className="pt-2 border-t border-indigo-950 flex justify-between text-3xs font-mono text-indigo-400">
                    <span>Lead-time: Hours</span>
                    <span>Subnetwork-aware</span>
                  </div>
                </div>

                {/* Recursion Pharmaceuticals */}
                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Recursion</h4>
                  <p className="text-slate-500 text-2xs leading-relaxed">
                    <strong>Phenotypic Imaging-First:</strong> Highly reliant on physical automated cellular microscopy. Slow feedback loops, restricted in-silico transferability, and no explicit pathway transformer attention layer.
                  </p>
                  <div className="pt-2 border-t border-slate-900 flex justify-between text-3xs font-mono text-slate-600">
                    <span>Lead-time: Months</span>
                    <span>Assay-dependent</span>
                  </div>
                </div>

                {/* Insilico Medicine */}
                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Insilico Medicine</h4>
                  <p className="text-slate-500 text-2xs leading-relaxed">
                    <strong>Generative Docking:</strong> Strong focus on generative chemistry and target molecular design, but typically misses context-informed heterogeneous network representations and RAG literary evaluation.
                  </p>
                  <div className="pt-2 border-t border-slate-900 flex justify-between text-3xs font-mono text-slate-600">
                    <span>Lead-time: Weeks</span>
                    <span>Isolated Protein Focus</span>
                  </div>
                </div>

                {/* BenchSci / ASCEND */}
                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">BenchSci ASCEND</h4>
                  <p className="text-slate-500 text-2xs leading-relaxed">
                    <strong>Literature Indexing:</strong> Strong information search for existing paper citations, but functions strictly as a retrospective RAG miner. No active graph deep-learning capability to project novel links.
                  </p>
                  <div className="pt-2 border-t border-slate-900 flex justify-between text-3xs font-mono text-slate-600">
                    <span>Lead-time: Days</span>
                    <span>Retrospective Only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case AppView.GRAPH_EXPLORER:
        return (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Biomedical Knowledge Graph</h2>
                <p className="text-xs text-slate-400 mt-0.5">Physical network representing active validation links mapping ChEMBL-DB and STRING-DB.</p>
              </div>
              {isCustomData && (
                <button onClick={resetData} className="text-xs text-rose-400 hover:text-rose-300 underline font-mono cursor-pointer">
                  Reset to Demo Ground Truth
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-xl relative p-1">
              <GraphVisualizer data={graphData} />
            </div>
          </div>
        );
      case AppView.TRAINING:
        return (
          <div className="h-full overflow-y-auto flex flex-col max-w-5xl mx-auto py-2 pr-1 pb-12">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Deep Transformer Learning Engine</h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time supervision metrics for HGT Link-attention and BioGPT embedding alignments.</p>
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 h-auto xl:h-[480px]">
               <TrainingMonitor data={TRAINING_METRICS} />
            </div>
          </div>
        );
      case AppView.PREDICTIONS:
        return (
          <div className="h-full flex flex-col">
             <div className="flex-1 overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-4">
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
      onClick={() => {
        setCurrentView(view);
        setIsMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-medium rounded-lg transition-all duration-150 ${
        currentView === view
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30 font-semibold'
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar Backdrop Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Collapsible Sidebar (Drawer layout) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 z-40 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand logo & Close trigger */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-indigo-500 mb-1">
                <FlaskConical size={24} className="text-indigo-400" />
                <span className="font-bold text-base tracking-wider text-slate-100 font-mono">BioGraph<span className="text-indigo-400">AI</span></span>
              </div>
              <p className="text-3xs text-slate-500 uppercase tracking-widest font-mono">Enterprise Repurposing Hub</p>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-md transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="p-3.5 space-y-1.5">
            <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Overview Dashboard" />
            <NavItem view={AppView.GRAPH_EXPLORER} icon={Network} label="Knowledge Graph" />
            <NavItem view={AppView.TRAINING} icon={BrainCircuit} label="Model Optimization" />
            <NavItem view={AppView.PREDICTIONS} icon={ListOrdered} label="Link Hypotheses" />
            <div className="pt-3 mt-3 border-t border-slate-800/80">
               <NavItem view={AppView.DATA_UPLOAD} icon={Database} label="Biological Ingestion" />
            </div>
          </nav>
        </div>

        {/* Model Statistics Panel (Upgraded to State-of-the-art 2026 Metrics) */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-800/60 space-y-2">
            <div className="text-3xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
               <BarChart4 size={10} className="text-indigo-400" /> Pipelines State (v4)
            </div>
            
            <div className="space-y-1 text-2xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Graph Nodes:</span>
                <span className="text-slate-300 font-mono font-medium">{graphData.nodes.length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Inferred Edges:</span>
                <span className="text-slate-300 font-mono font-medium">{graphData.links.length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">HGT AUROC:</span>
                <span className="text-emerald-400 font-mono font-bold">0.945</span>
              </div>
            </div>
          </div>
          
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()} 
            className="flex items-center gap-1.5 text-3xs text-slate-500 mt-3.5 hover:text-slate-300 justify-center font-mono uppercase"
          >
            <Github size={11} /> view hgt_gpt_fusion.py
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {/* Responsive Burger Menu Trigger */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 px-3"
                title="Expand Platform Menu"
              >
                <Menu size={16} />
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-slate-300 hidden sm:inline">Menu</span>
              </button>

              <h1 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                {currentView === AppView.DASHBOARD && 'HGT DISCOVERY CONSOLE'}
                {currentView === AppView.GRAPH_EXPLORER && 'HETEROGENEOUS METABOLIC GRAPH INSPECTOR'}
                {currentView === AppView.TRAINING && 'GNN TRANSFORMER OPTIMIZATION TELEMETRY'}
                {currentView === AppView.PREDICTIONS && 'INFERRED HYPOTHESES WORKSPACE'}
                {currentView === AppView.DATA_UPLOAD && 'INGESTION LAYER & PIPELINE PIPES'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
                 <span className={`w-2 h-2 rounded-full ${isCustomData ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
                 {isCustomData ? 'Custom Dynamic Trial' : 'Enterprise Engine Ready'}
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-indigo-400 font-mono" title="Pharma Partner Access: JD">
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
