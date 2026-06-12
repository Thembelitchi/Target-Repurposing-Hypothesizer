import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  BookOpen, 
  Sparkles, 
  Dna, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Download,
  Terminal,
  FileText
} from 'lucide-react';

interface ApplicationDemoProps {
  onApplyPreset?: (compound: string, target: string, threshold: number) => void;
  onNavigateView?: (view: any) => void;
}

export const ApplicationDemo: React.FC<ApplicationDemoProps> = ({ onApplyPreset, onNavigateView }) => {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number>(0);
  const [pipelineStage, setPipelineStage] = useState<'idle' | 'ingesting' | 'attending' | 'embedding' | 'synthesizing' | 'completed'>('idle');
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [showDossier, setShowDossier] = useState<boolean>(false);

  const demoPresets = [
    {
      molecule: 'Metformin',
      originalIndication: 'Type 2 Diabetes mellitus',
      targetIndication: 'Oncology (mTOR-mediated pancreatic adenocarcinoma)',
      targetProtein: 'mTOR (PRKAA1 / MTOR Axis)',
      ensembId: 'ENSG00000198793',
      gnnProbability: 0.925,
      pathwayRoute: 'Metformin ──[AMPK Activation]──> mTOR inhibition ──[Autophagy induction]──> Tumor reduction',
      scientificAbstract: 'Metformin activates adenosine monophosphate-activated protein kinase (AMPK), leading to downstream multi-head phosphorylation-induced suppression of the mechanistic target of rapamycin (mTOR) complex. Our Heterogeneous Graph Transformer (HGT) predicts a high affinity link prediction score of 0.925, suggesting therapeutic disruption of cell growth pathways in pancreatic cell lines.',
      mechanisms: [
        'Direct phosphorylation of raptor by AMPK',
        'Reduction of insulin/IGF-1 systemic circulating levels',
        'Inhibition of complex I of the mitochondrial respiratory chain'
      ],
      citation: 'J. Clinical Oncology, Sec 12.4 (2025)'
    },
    {
      molecule: 'Atorvastatin',
      originalIndication: 'Hypercholesterolemia',
      targetIndication: 'Neuroinflammation (Alzheimer\'s microglia signaling)',
      targetProtein: 'NF-kB (NFKB1 Prostaglandin cascade)',
      ensembId: 'ENSG00000109320',
      gnnProbability: 0.894,
      pathwayRoute: 'Atorvastatin ──[HMG-CoA Reductase block]──> Microglial deactivated NF-kB transcription cascade',
      scientificAbstract: 'Pleiotropic effects of statins include non-lipid mediated direct binding parameters on microglial structural interfaces. HGT link prediction maps an interaction coefficient of 0.894, correlating with reduced downstream pro-inflammatory nitric oxide and TNF-alpha levels.',
      mechanisms: [
        'Inhibition of isoprenoid intermediate biosynthesis',
        'Up-regulation of I-kappa-B kinase complex stability',
        'Pruning of inflammatory microglial migration paths'
      ],
      citation: 'Neurotherapeutics Academy Pre-prints, vol 45 (2026)'
    },
    {
      molecule: 'Doxycycline',
      originalIndication: 'Broad-spectrum Bacterial Infection',
      targetIndication: 'Oncology (Metastatic Extracellular Matrix invasion)',
      targetProtein: 'MMP-9 (Matrix Metalloproteinase)',
      ensembId: 'ENSG00000100985',
      gnnProbability: 0.941,
      pathwayRoute: 'Doxycycline ──[Zn2+ divalent metal ion chelation]──> Metalloproteinase-9 secondary structure collapse',
      scientificAbstract: 'Matrix metalloproteinases (MMPs) are zinc-dependent endopeptidases that degrade extracellular matrix components during tumor metastasis. Doxycycline binds tightly within the Zn-dependent active pocket, independently of its antibacterial ribosomal actions, yielding an optimized GNN priority link validation of 0.941.',
      mechanisms: [
        'Chelation of secondary Zn2+ structural coordinate ions',
        'Translational suppression of pro-MMP9 proenzyme precursors',
        'Induction of cell-matrix adherence adhesion loops'
      ],
      citation: 'Nature Cancer Discoveries, vol 189-A (2025)'
    }
  ];

  const currentPreset = demoPresets[selectedDemoIndex];

  // Simulating pipeline steps
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pipelineStage === 'ingesting') {
      setPipelineLogs([
        '⚡ [HOST INIT] Establishing secure subnet gateway...',
        `🧬 [INGEST] Querying multi-relational attributes of target: ${currentPreset.targetProtein}`,
        '📁 [INGEST] Structural descriptors parsed (ChEMBL structural coordinates mapped)'
      ]);
      timer = setTimeout(() => setPipelineStage('attending'), 1400);
    } else if (pipelineStage === 'attending') {
      setPipelineLogs(prev => [
        ...prev,
        '🎚️ [GNN MATH] Initializing Heterogeneous Multi-Head Attention layers...',
        '🧠 [GNN MATH] Relation-specific weights projected: COM-to-PRO relation weight coefficient: 0.82',
        '🔬 [GNN MATH] Executing 4 hidden blocks self-attention convolution iterations...'
      ]);
      timer = setTimeout(() => setPipelineStage('embedding'), 1400);
    } else if (pipelineStage === 'embedding') {
      setPipelineLogs(prev => [
        ...prev,
        '🕸️ [GNN MATH] Projecting target representations to aligned semantic subspaces...',
        '📉 [GNN MATH] Evaluating local convergence entropy: Loss = 0.1482 | AUROC = 0.9450',
        `🎯 [GNN MATH] Mapped candidate node link probability established: ${currentPreset.gnnProbability}`
      ]);
      timer = setTimeout(() => setPipelineStage('synthesizing'), 1400);
    } else if (pipelineStage === 'synthesizing') {
      setPipelineLogs(prev => [
        ...prev,
        '🤖 [BioGPT-4] Initiating cognitive bioreasoning agent proxy...',
        '📖 [BioGPT-4] Aligning physical graph with PubMed RAG citation indexes...',
        '✅ [BioGPT-4] Dossier validation compiled successfully.'
      ]);
      timer = setTimeout(() => {
        setPipelineStage('completed');
        setShowDossier(true);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [pipelineStage, selectedDemoIndex]);

  const handleRunDemo = () => {
    setPipelineStage('ingesting');
    setShowDossier(false);
  };

  const handleResetDemo = () => {
    setPipelineStage('idle');
    setPipelineLogs([]);
    setShowDossier(false);
  };

  // Quick preset application helper
  const handleApplyPresetToFilters = () => {
    if (onApplyPreset) {
      onApplyPreset(currentPreset.molecule, currentPreset.targetProtein, currentPreset.gnnProbability - 0.05);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-2xl relative" id="interactive-demo-core-card">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-slate-850/60 mb-5">
        <div>
          <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-widest font-mono flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-400 animate-pulse" />
            <span>Interactive repurposing pipeline demo</span>
          </h2>
          <p className="text-4xs text-slate-400 font-mono mt-0.5">
            Simulate a full drug repurposing validation run showing physical spatial GNN inference, self-attention, and RAG literature alignment.
          </p>
        </div>

        {/* Preset selectors */}
        <div className="flex flex-wrap gap-1.5 font-mono text-5xs shrink-0 bg-slate-950 p-1 rounded-lg border border-slate-855">
          {demoPresets.map((preset, i) => (
            <button
              key={preset.molecule}
              onClick={() => {
                setSelectedDemoIndex(i);
                handleResetDemo();
              }}
              disabled={pipelineStage !== 'idle' && pipelineStage !== 'completed'}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
                selectedDemoIndex === i
                  ? 'bg-indigo-600 text-slate-100'
                  : 'text-slate-500 hover:text-slate-350 disabled:opacity-50'
              }`}
            >
              Demo {i + 1}: {preset.molecule}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Simulation Controller */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Target Metadata Panel */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-3 font-mono">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-5xs bg-indigo-950 text-indigo-400 border border-indigo-900 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest leading-none">
                  Small Molecule Lead
                </span>
                <h3 className="text-base font-extrabold text-slate-100 mt-1 leading-tight">{currentPreset.molecule}</h3>
                <span className="text-5xs text-slate-500 block mt-0.5">Primary Indication: {currentPreset.originalIndication}</span>
              </div>
              <div className="text-right">
                <span className="text-5xs text-slate-500">GNN PREDICTED PROBABILITY</span>
                <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                  {(currentPreset.gnnProbability * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-850" />

            <div className="space-y-1">
              <span className="text-5xs text-slate-500 uppercase font-bold">Unchartered target protein indication path</span>
              <div className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                <Dna size={12} className="shrink-0" />
                {currentPreset.targetProtein}
              </div>
              <p className="text-5xs text-slate-400 leading-relaxed mt-1">
                Target expansion focuses on mapping the candidate molecule on <strong className="text-slate-300">{currentPreset.targetIndication}</strong>.
              </p>
            </div>

            {/* Simulated Pathway mapping text schema */}
            <div className="bg-slate-950/90 text-4xs p-2 rounded border border-slate-900 font-mono text-slate-400 italic leading-normal border-l-2 border-l-indigo-500">
              {currentPreset.pathwayRoute}
            </div>
          </div>

          {/* Action trigger button block */}
          <div className="flex gap-2.5">
            {pipelineStage === 'idle' ? (
              <button
                onClick={handleRunDemo}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-mono font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play size={13} fill="currentColor" />
                <span>Initiate GNN Inference Pipeline</span>
              </button>
            ) : (
              <button
                onClick={handleResetDemo}
                className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-205 border border-slate-850 font-mono font-bold uppercase text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Demo</span>
              </button>
            )}

            {pipelineStage === 'completed' && (
              <button
                onClick={handleApplyPresetToFilters}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold uppercase text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
                title="Automatically configure dashboard filters for Metformin, Atorvastatin or Doxycycline"
              >
                <CheckCircle2 size={13} />
                <span>Apply to workspace</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Execution trace terminal & BioGPT outcome dossier */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          <div className="bg-slate-950 rounded-xl border border-slate-850 p-4 h-64 overflow-y-auto flex flex-col font-mono text-4xs text-slate-300 leading-relaxed space-y-2 relative">
            <div className="sticky top-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-between pb-1.5 border-b border-slate-850 mb-1 shrink-0">
              <span className="text-5xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                <Terminal size={10} /> Active Pipeline trace logs
              </span>
              <span className="text-5xs px-1.5 py-0.5 rounded bg-slate-900 border border-slate-805 text-slate-400 capitalize">
                Stage: {pipelineStage}
              </span>
            </div>

            {pipelineStage === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600 space-y-1 bg-slate-950 py-4 font-mono leading-relaxed">
                <span>Pipeline engine in standby.</span>
                <span>Select a Preset on the top right and click "Initiate GNN Inference Pipeline" above to run the demo.</span>
              </div>
            )}

            {pipelineStage !== 'idle' && (
              <div className="space-y-1.5">
                {pipelineLogs.map((log, index) => {
                  let logColor = "text-slate-300";
                  if (log.includes("[INGEST]")) logColor = "text-amber-500";
                  if (log.includes("[GNN MATH]")) logColor = "text-indigo-400";
                  if (log.includes("[BioGPT-4]")) logColor = "text-purple-400 font-semibold";
                  return (
                    <div key={index} className={`${logColor} animate-fade-in`}>
                      {log}
                    </div>
                  );
                })}
                {pipelineStage !== 'completed' && (
                  <div className="flex items-center gap-1.5 text-indigo-400 px-1 py-0.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                    <span>Processing graph tensor calculations...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dossier Overlay/Panel */}
          {showDossier && (
            <div className="mt-4 p-4.5 bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-950/60 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3 font-sans">
              <div className="flex justify-between items-center">
                <span className="text-5xs font-mono font-extrabold uppercase bg-emerald-950 border border-emerald-900 text-emerald-450 px-2.5 py-1 rounded flex items-center gap-1">
                  <CheckCircle2 size={10} /> Model Dossier Compiled
                </span>
                <span className="text-4xs font-mono text-slate-500">
                  Ref: <strong className="text-slate-400">{currentPreset.citation}</strong>
                </span>
              </div>

              <div className="text-3xs text-slate-300 leading-relaxed font-sans text-justify">
                <strong className="text-slate-201 block mb-1 font-mono uppercase text-4xs tracking-widest text-indigo-300 flex items-center gap-1">
                  <FileText size={10} /> Scientific Abstract
                </strong>
                {currentPreset.scientificAbstract}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-4xs font-mono">
                <div>
                  <strong className="text-slate-500 block mb-1 font-sans">MECHANISTIC CASCADE CHUNKS</strong>
                  <ul className="space-y-1 list-disc list-inside text-indigo-300">
                    {currentPreset.mechanisms.map((mech, i) => (
                      <li key={i} className="truncate" title={mech}>{mech}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-end items-end space-y-2">
                  <span className="text-slate-500 block">ENCODE GENOMICS INDEX</span>
                  <a
                    href={`https://platform.opentargets.org/target/${currentPreset.ensembId}`}
                    target="_blank"
                    rel="noreferrer referrer"
                    className="inline-flex items-center gap-1 bg-indigo-950/50 hover:bg-indigo-900/40 text-indigo-400 border border-indigo-900/40 px-3 py-1.5 rounded text-5xs uppercase tracking-widest font-bold font-mono cursor-pointer"
                  >
                    OpenTargets: {currentPreset.ensembId}
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {showDossier && (
        <div className="absolute top-4 right-4 animate-bounce hidden md:block">
          <span className="p-1 px-2.5 rounded bg-emerald-950 border border-emerald-900 text-emerald-400 text-5xs uppercase font-mono tracking-wider font-bold">
            Interactive Dossier Ready
          </span>
        </div>
      )}

    </div>
  );
};

export default ApplicationDemo;
