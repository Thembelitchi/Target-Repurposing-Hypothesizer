import React, { useState, useMemo, useEffect } from 'react';
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
  Database,
  Compass,
  Cpu,
  Sparkles,
  GitMerge,
  BarChart4,
  Search,
  X,
  Sliders,
  Terminal,
  Activity,
  Globe,
  PlusCircle,
  FlaskConical,
  ExternalLink,
  Lock,
  Workflow
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [graphData, setGraphData] = useState<GraphData>(INITIAL_GRAPH_DATA);
  const [predictions, setPredictions] = useState<Prediction[]>(PREDICTIONS_DATA);
  const [isCustomData, setIsCustomData] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isMLOpsDropdownOpen, setIsMLOpsDropdownOpen] = useState(false);

  // Global search filters
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalThreshold, setGlobalThreshold] = useState(0.0);

  const handleDataLoaded = (newGraph: GraphData, newPredictions: Prediction[]) => {
    setGraphData(newGraph);
    setPredictions(newPredictions);
    setIsCustomData(true);
    setCurrentView(AppView.DASHBOARD);
  };

  const resetData = () => {
    setGraphData(INITIAL_GRAPH_DATA);
    setPredictions(PREDICTIONS_DATA);
    setIsCustomData(false);
    setCurrentView(AppView.DASHBOARD);
  };

  // Synchronize ESC key to close open overlays/modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsGraphModalOpen(false);
        setIsMLOpsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute filtered hypotheses inside parent
  const filteredPredictions = useMemo(() => {
    return predictions.filter(pred => {
      // Threshold check on link GNN probability
      if (pred.probability < globalThreshold) return false;

      // Text query match on compound Name, Target symbol, registry ID or uniProt provenance
      if (globalSearchQuery.trim()) {
        const query = globalSearchQuery.toLowerCase();
        const matchesCompound = pred.compoundName.toLowerCase().includes(query) || pred.provenance.toLowerCase().includes(query);
        const matchesProtein = pred.proteinName.toLowerCase().includes(query) || pred.targetProvenance.toLowerCase().includes(query);
        return matchesCompound || matchesProtein;
      }
      return true;
    });
  }, [predictions, globalSearchQuery, globalThreshold]);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1 pb-16" id="dashboard-view-panel">
            {/* Main Single-Column Hero: Hypotheses Table holds 100% immediate focal attention */}
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-xl" id="hero-predictions-card">
              <PredictionTable 
                predictions={filteredPredictions} 
                onViewGraph={() => setIsGraphModalOpen(true)}
              />
            </div>

            {/* Bottom Row: Compression of Telemetry updates */}
            <div className="space-y-3" id="optimization-telemetry-container">
              <span className="text-4xs uppercase tracking-widest font-bold text-slate-500 font-mono block">Integrated Deep Learning Pipeline</span>
              <TrainingMonitor data={TRAINING_METRICS} />
            </div>
          </div>
        );

      case AppView.GRAPH_EXPLORER:
        return (
          <div className="h-full flex flex-col gap-4" id="graph-explorer-panel">
            <div className="flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Biomedical Knowledge Graph (HGT Embedding Plane)</h2>
                <p className="text-4xs text-slate-400 font-mono mt-0.5">Explore active target validation links mapping ChEMBL-DB registry pairs and STRING-DB functional proteins.</p>
              </div>
              {isCustomData && (
                <button 
                  onClick={resetData} 
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono font-semibold hover:underline cursor-pointer"
                  id="btn-reset-ground-truth"
                >
                  Reset parameters to default
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0 bg-slate-905 border border-slate-850 rounded-xl relative p-1 overflow-hidden" id="graph-explorer-canvas">
              <GraphVisualizer data={graphData} edgeThreshold={globalThreshold} />
            </div>
          </div>
        );

      case AppView.TRAINING:
        return (
          <div className="h-full flex flex-col gap-4 max-w-5xl mx-auto py-2 pr-1 pb-12" id="training-opt-panel">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">GNN Optimizer & Convergence monitor</h2>
              <p className="text-4xs text-slate-400 font-mono mt-0.5">Supervise structural multi-head self attention GNN embedding weight alignments.</p>
            </div>
            <div className="bg-slate-900/40 rounded-xl border border-slate-850 p-1 flex-1">
               <TrainingMonitor data={TRAINING_METRICS} />
            </div>
          </div>
        );

      case AppView.PREDICTIONS:
        return (
          <div className="h-full flex flex-col gap-4" id="all-hypotheses-panel">
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 flex-1 overflow-hidden">
               <PredictionTable 
                 predictions={filteredPredictions} 
                 onViewGraph={() => setIsGraphModalOpen(true)}
               />
            </div>
          </div>
        );

      case AppView.DATA_UPLOAD:
        return (
          <div className="h-full overflow-y-auto pb-12" id="data-ingestion-panel">
            <DataUpload onDataLoaded={handleDataLoaded} />
          </div>
        );

      case AppView.ABOUT:
        return (
          <div className="h-full overflow-y-auto max-w-5xl mx-auto pr-1 pb-16 space-y-8" id="about-panel">
            {/* Strategic Overview header */}
            <div className="space-y-1.5 pb-4 border-b border-slate-850">
              <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Compass size={14} className="text-indigo-400" /> Strategic Benchmark Positioning Matrix
              </h2>
              <p className="text-xs text-slate-400">Comparing competitive systems and methodologies within target validation and AI-driven drug repurposing pipelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BioGraphAI Platform */}
              <div className="bg-slate-900 border-2 border-indigo-500/45 p-6 rounded-2xl relative space-y-4">
                <span className="absolute top-4 right-4 text-4xs font-mono font-bold bg-indigo-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">ACTIVE INSTANCE ENGINE</span>
                <div className="flex items-center gap-2">
                  <Workflow size={18} className="text-indigo-400" />
                  <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest font-mono">BioGraphAI Pipeline (v4.1)</h3>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  Our advanced GNN architecture implements <strong>Heterogeneous Link Attention (HLA-Layers)</strong> coupled with real-time <strong>BioGPT-4 linguistic tokenization</strong>.
                  By combining deep structural grid paths with context-informed paper reasoning, we generate actionable target interaction scores in minutes instead of months.
                </p>
                <div className="pt-3 border-t border-slate-850 grid grid-cols-2 text-4xs font-mono text-indigo-300">
                  <div>• Leads pipeline time: <strong className="text-slate-100 font-bold block pt-0.5">Hours</strong></div>
                  <div>• Cascade-aware: <strong className="text-emerald-400 font-bold block pt-0.5">Dual-mode (Subnet)</strong></div>
                </div>
              </div>

              {/* Recursion Pharmaceutical approach */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4 text-xs">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Phenotypic Imaging (Recursion Style)</h3>
                <p className="text-slate-400 leading-relaxed font-sans">
                  Relying strictly on high-throughput robotic cellular slide cameras produces vast imaging vectors. However, biological translation lacks pathways feedback, pipeline processing takes months, and transferability is constrained by expensive physical reagent cell plates.
                </p>
                <div className="pt-3 border-t border-slate-850 grid grid-cols-2 text-4xs font-mono text-slate-500">
                  <div>• Leads pipeline time: <span className="block pt-0.5 text-slate-400 font-mono">3-6 Months</span></div>
                  <div>• Cascade-aware: <span className="block pt-0.5 text-slate-400 font-mono">Assay Dependent</span></div>
                </div>
              </div>

              {/* Insilico Machine Learning style */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4 text-xs">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Isolated Target Docking (Insilico Style)</h3>
                <p className="text-slate-400 leading-relaxed font-sans">
                  Strong chemical generators design custom molecular bindings with high affinity scores. However, they analyze proteins in isolation, entirely ignoring structural biological cascades and context-informed physical network pathways mapping.
                </p>
                <div className="pt-3 border-t border-slate-850 grid grid-cols-2 text-4xs font-mono text-slate-500">
                  <div>• Leads pipeline time: <span className="block pt-0.5 text-slate-400 font-mono">2-4 Weeks</span></div>
                  <div>• Cascade-aware: <span className="block pt-0.5 text-slate-400 font-mono">None (Isolated Hubs)</span></div>
                </div>
              </div>

              {/* BenchSci retroactive search indexes */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4 text-xs">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Retrospective RAG Mines (BenchSci style)</h3>
                <p className="text-slate-400 leading-relaxed">
                  Excellent search engines read historical papers to compile previously mapped targets. However, these systems function strictly as retrospective indexing scrapers and can never predict synthetic, novel target linkage probabilities.
                </p>
                <div className="pt-3 border-t border-slate-850 grid grid-cols-2 text-4xs font-mono text-slate-500">
                  <div>• Leads pipeline time: <span className="block pt-0.5 text-slate-400 font-mono">Immediate</span></div>
                  <div>• Cascade-aware: <span className="block pt-0.5 text-slate-400 font-mono">Static Literature Map</span></div>
                </div>
              </div>
            </div>

            {/* Strategic Advantage */}
            <div className="p-5 bg-gradient-to-r from-indigo-950/20 to-slate-900 border border-indigo-950 rounded-2xl space-y-2 text-xs">
              <h4 className="font-bold text-slate-100 font-mono uppercase tracking-wider text-2xs flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-400" /> Platform Deployment & Compliance
              </h4>
              <p className="text-slate-400 font-sans leading-relaxed">
                BioGraphAI incorporates certified healthcare security measures, holding active SOC-2 Type-II auditing compliance. The platform has been integrated directly into major R&D global hubs to accelerate multi-indication validation programs securely.
              </p>
            </div>
          </div>
        );

      default:
        return <div className="text-xs font-mono p-4 text-slate-400">Undefined view route. Please retry navigation.</div>;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
      }}
      className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer ${
        currentView === view
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 text-glow'
          : 'text-slate-500 hover:text-slate-205 hover:bg-slate-900/60'
      }`}
      title={label}
      aria-label={label}
      id={`nav-${view.toLowerCase()}`}
    >
      <Icon size={20} />
      
      {/* Dynamic Hover Tooltip */}
      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-950 border border-slate-850 text-slate-200 text-4xs uppercase tracking-widest font-mono rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 pointer-events-none whitespace-nowrap">
        {label}
      </div>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* 1. Sleek minimal Icon Rail navigation sidebar (exactly 5 icons as required + quiet docs link at bottom) */}
      <aside className="w-18 bg-slate-900 border-r border-slate-850/80 flex flex-col justify-between items-center py-5 shrink-0 z-40" id="sidebar-icon-rail">
        <div className="space-y-6 flex flex-col items-center">
          {/* Subtle quiet micro logo icon */}
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850/60 flex items-center justify-center text-indigo-500 cursor-pointer shadow-inner shadow-indigo-950/20" title="BioGraphAI Platform Engine">
            <FlaskConical size={18} className="text-indigo-400" />
          </div>

          <div className="h-px w-8 bg-slate-800" />

          {/* 5 required functional navigation icons */}
          <nav className="flex flex-col gap-3">
            <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Overview Dashboard" />
            <NavItem view={AppView.GRAPH_EXPLORER} icon={Network} label="Knowledge Graph Explorer" />
            <NavItem view={AppView.TRAINING} icon={BrainCircuit} label="Model Optimization" />
            <NavItem view={AppView.PREDICTIONS} icon={ListOrdered} label="Link Hypotheses" />
            <NavItem view={AppView.DATA_UPLOAD} icon={Database} label="Biological Ingestion" />
          </nav>
        </div>

        {/* Separated lower-contrast bottom about strategic position page button */}
        <div className="flex flex-col gap-4 items-center">
          <div className="h-px w-8 bg-slate-800" />
          <button
            onClick={() => setCurrentView(AppView.ABOUT)}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer ${
              currentView === AppView.ABOUT
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 text-glow'
                : 'text-slate-600 hover:text-slate-300 hover:bg-slate-900/40'
            }`}
            title="Strategic Benchmarking Documentation"
            aria-label="Docs"
            id="nav-about-trigger"
          >
            <Compass size={20} />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-950 border border-slate-850 text-slate-200 text-4xs uppercase tracking-widest font-mono rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 pointer-events-none whitespace-nowrap">
              Benchmark Docs
            </div>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Core Wrapper */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header App Bar */}
        <header className="min-h-16 h-auto py-3 md:py-0 border-b border-slate-850 bg-slate-900/50 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between px-4 sm:px-6 shrink-0 relative z-30 gap-3 md:gap-4" id="main-app-header">
            {/* Top Row on Mobile: Brand and Profile / Status toggler */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <FlaskConical size={18} className="text-indigo-400" />
                <div className="flex flex-col">
                  <h1 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-widest font-mono text-indigo-400 leading-none">
                    BIOGRAPH<span className="text-slate-100">AI</span>
                  </h1>
                  <span className="text-5xs text-slate-500 uppercase font-mono tracking-widest font-bold mt-1.5 block leading-none">Enterprise Repurposing Hub</span>
                </div>
              </div>

              {/* Mobile Status Toggler & Profile Box (hidden on desktop) */}
              <div className="flex md:hidden items-center gap-2 relative">
                <button
                  onClick={() => setIsMLOpsDropdownOpen(!isMLOpsDropdownOpen)}
                  className={`flex items-center gap-1 bg-slate-950 border px-2.5 py-1.5 rounded-lg text-5xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    isMLOpsDropdownOpen ? 'border-indigo-500 text-indigo-400 bg-indigo-950/40' : 'border-slate-850 text-slate-400'
                  }`}
                  title="System Status Indicator"
                >
                  <Cpu size={10} className={isMLOpsDropdownOpen ? "text-indigo-400 animate-spin-slow" : "text-slate-500"} />
                  <span>Status</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>

                {/* Highly structured MLOps observational popover panel for Mobile */}
                {isMLOpsDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40 cursor-pointer" onClick={() => setIsMLOpsDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-slate-950 border border-slate-850 rounded-xl shadow-2xl p-4 z-50 text-xs text-slate-355 space-y-3 font-mono">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                        <span className="text-5xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1">
                          <Terminal size={11} /> MLOps Observability
                        </span>
                        <span className="text-5xs bg-emerald-950/80 text-emerald-450 border border-emerald-900 px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">LIVE</span>
                      </div>

                      <div className="space-y-1.5 text-5xs font-medium">
                        <div className="flex flex-col bg-slate-900/60 p-1.5 rounded border border-slate-900">
                          <span className="text-slate-500">EXPERIMENT TRACKER</span>
                          <strong className="text-slate-250 font-semibold">W&B Enterprise Matrix</strong>
                        </div>
                        <div className="flex flex-col bg-slate-900/60 p-1.5 rounded border border-slate-900">
                          <span className="text-slate-500 font-mono">GPU NODES</span>
                          <strong className="text-slate-250 font-mono">GCP NVIDIA L4 Cluster</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsMLOpsDropdownOpen(false)}
                        className="w-full py-1 bg-slate-900 text-slate-400 hover:text-slate-200 rounded text-5xs transition-colors uppercase font-bold cursor-pointer"
                      >
                        Close Stats
                      </button>
                    </div>
                  </>
                )}
                
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white font-mono border border-indigo-455">
                  JD
                </div>
              </div>
            </div>

            {/* Middle Row: Global Search and GNN threshold filters */}
            <div className="flex items-center gap-2.5 flex-1 justify-center max-w-full md:max-w-xl md:mx-4" id="header-filters-cluster">
              {/* Global search bar targeting compound/protein */}
              <div className="relative flex-1 max-w-xs md:max-w-sm" id="header-search-wrapper">
                <input
                  type="text"
                  placeholder="Search target / compound..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-550/60 rounded-lg px-2.5 py-1.5 pl-8 text-xs text-slate-200 placeholder-slate-505 focus:outline-none transition-all font-mono"
                />
                <Search size={11} className="absolute left-2.5 top-2.5 text-slate-500" />
                {globalSearchQuery && (
                  <button 
                    onClick={() => setGlobalSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    title="Clear Search"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>

              {/* Threshold filter selector next to the search bar */}
              <div className="flex items-center gap-1 font-mono text-5xs shrink-0" id="header-threshold-wrapper">
                <Sliders size={11} className="text-indigo-400 shrink-0" />
                <select
                  value={globalThreshold}
                  onChange={(e) => setGlobalThreshold(parseFloat(e.target.value))}
                  className="bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-lg px-2 py-1.5 text-5xs text-indigo-400 font-bold focus:outline-none cursor-pointer font-mono"
                  title="Probability validation threshold filter"
                >
                  <option value="0.0">GNN THRESHOLD: ALL</option>
                  <option value="0.5">GNN THRESHOLD: ≥ 0.50</option>
                  <option value="0.7">GNN THRESHOLD: ≥ 0.70</option>
                  <option value="0.8">GNN THRESHOLD: ≥ 0.80</option>
                  <option value="0.9">GNN THRESHOLD: ≥ 0.90</option>
                </select>
              </div>
            </div>

            {/* Right Side Status & Observability settings (Visible only on desktop md and up) */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {/* MLOps observational status toggler dropdown */}
              <div className="relative" id="mlops-observability-popover">
                <button
                  onClick={() => setIsMLOpsDropdownOpen(!isMLOpsDropdownOpen)}
                  className={`flex items-center gap-1.5 text-3xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isMLOpsDropdownOpen 
                      ? 'bg-indigo-950/50 border-indigo-500 text-indigo-400' 
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-205'
                  }`}
                  title="System observability parameters"
                >
                  <Cpu size={12} className={isMLOpsDropdownOpen ? "text-indigo-400 animate-spin-slow" : "text-slate-500"} />
                  <span>System Status</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>

                {/* Highly structured MLOps observational popover panel */}
                {isMLOpsDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40 cursor-pointer" onClick={() => setIsMLOpsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2.5 w-72 bg-slate-950 border border-slate-850 rounded-xl shadow-2xl p-4.5 z-50 text-xs text-slate-355 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150 font-mono">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                        <span className="text-4xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1">
                          <Terminal size={11} /> MLOps Pipeline Observability
                        </span>
                        <span className="text-5xs bg-emerald-950/80 text-emerald-455 border border-emerald-900 px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">LIVE</span>
                      </div>

                      <div className="space-y-2 text-3xs font-medium">
                        <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2 rounded border border-slate-900">
                          <span className="text-slate-500 text-3xs uppercase">EXPERIMENT TRACKER</span>
                          <strong className="text-slate-250 font-semibold">Weights & Biases (Enterprise)</strong>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2 rounded border border-slate-900">
                          <span className="text-slate-500 text-3xs uppercase">MODEL ARTIFACT REGISTRY</span>
                          <strong className="text-slate-250 font-mono">MLflow Registry v4.12.5</strong>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2 rounded border border-slate-900">
                          <span className="text-slate-500 text-3xs uppercase">GPU INFERENCE CLUSTER</span>
                          <strong className="text-slate-250 font-mono">GCP Vertex AI - NVIDIA L4 Node</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-850 space-y-1.5">
                        <span className="text-5xs uppercase text-slate-500 font-bold block">MODEL HYPERPARAMETERS</span>
                        <div className="grid grid-cols-2 gap-1.5 text-3xs font-mono">
                          <div className="bg-slate-900/30 p-1.5 rounded border border-slate-850 text-center">
                            <span className="text-slate-500 block">HIDDEN DIM</span>
                            <span className="text-slate-300 font-bold">512</span>
                          </div>
                          <div className="bg-slate-900/30 p-1.5 rounded border border-slate-850 text-center">
                            <span className="text-slate-500 block">HEADS</span>
                            <span className="text-slate-300 font-bold">8</span>
                          </div>
                          <div className="bg-slate-900/30 p-1.5 rounded border border-slate-850 text-center">
                            <span className="text-slate-500 block">LAYERS</span>
                            <span className="text-slate-300 font-bold">4 Blocks</span>
                          </div>
                          <div className="bg-slate-900/30 p-1.5 rounded border border-slate-850 text-center">
                            <span className="text-slate-550 block">OPTIMIZER</span>
                            <span className="text-slate-305 font-bold truncate block font-mono">AdamW</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-850 flex text-center">
                        <button
                          onClick={() => setIsMLOpsDropdownOpen(false)}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-805 text-slate-400 hover:text-slate-205 rounded text-3xs transition-colors uppercase font-bold cursor-pointer"
                        >
                          Minimize Stats
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Developer credentials avatar indicator */}
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-indigo-450 font-mono" title="Validated Pharma Account Profile: JD">
                JD
              </div>
            </div>
        </header>
        
        {/* Inner page layout canvas */}
        <div className="flex-1 p-6 overflow-hidden">
          {renderContent()}
        </div>
      </main>

      {/* 3. Streamlined Graph overlay focus modal (collapsed from dashboard top split-screen) */}
      {isGraphModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 transition-opacity cursor-pointer duration-200"
            onClick={() => setIsGraphModalOpen(false)}
            id="graph-modal-backdrop"
          />
          <div className="fixed inset-4 md:inset-y-12 md:right-12 md:left-24 bg-slate-950 border border-slate-850 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col p-5 animate-in zoom-in-95 duration-200" id="graph-modal-dialog">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-850 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-950/80 text-indigo-400 border border-indigo-900/40 rounded-lg">
                  <Network size={16} />
                </span>
                <div>
                  <h2 className="text-xs font-bold text-slate-100 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    Biological Knowledge Graph Plane
                  </h2>
                  <p className="text-5xs text-slate-500 font-mono mt-0.5">Physical network representing mapped interaction targets. Set min confidence in top bar to isolate clusters.</p>
                </div>
              </div>
              <button
                onClick={() => setIsGraphModalOpen(false)}
                className="p-1 px-3 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-100 font-mono text-3xs uppercase font-bold cursor-pointer transition-all"
                id="btn-close-graph-modal"
              >
                Close [Esc]
              </button>
            </div>
            
            {/* Modal Graph Visualizer Space */}
            <div className="flex-1 min-h-0 relative mt-4">
              <GraphVisualizer data={graphData} edgeThreshold={globalThreshold} />
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default App;
