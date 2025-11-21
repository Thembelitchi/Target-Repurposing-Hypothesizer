import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, ArrowRight, Database } from 'lucide-react';
import { parseCSV, processDatasets } from '../services/dataProcessor';
import { GraphData, Prediction } from '../types';

interface DataUploadProps {
  onDataLoaded: (graph: GraphData, predictions: Prediction[]) => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataLoaded }) => {
  const [interactionFile, setInteractionFile] = useState<File | null>(null);
  const [featureFile, setFeatureFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{nodes: number, edges: number} | null>(null);

  const interactionInputRef = useRef<HTMLInputElement>(null);
  const featureInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'interactions' | 'features') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'interactions') setInteractionFile(e.target.files[0]);
      else setFeatureFile(e.target.files[0]);
      setError(null);
      setSuccessInfo(null);
    }
  };

  const processFiles = async () => {
    if (!interactionFile) {
      setError("Interaction Data CSV is required.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Read files
      const interactionText = await readFile(interactionFile);
      const featureText = featureFile ? await readFile(featureFile) : "";

      // Parse
      const interactionData = parseCSV(interactionText);
      const featureData = featureText ? parseCSV(featureText) : [];

      // Validation
      if (interactionData.length === 0) {
        throw new Error("Interaction file appears to be empty or invalid.");
      }
      
      // Check for required columns in at least one row
      const sampleRow = interactionData[0];
      // Allow flexibility in header names
      const hasSource = sampleRow.hasOwnProperty('compound_id') || sampleRow.hasOwnProperty('source') || sampleRow.hasOwnProperty('drug') || sampleRow.hasOwnProperty('compound');
      const hasTarget = sampleRow.hasOwnProperty('protein_id') || sampleRow.hasOwnProperty('target') || sampleRow.hasOwnProperty('protein');

      if (!hasSource || !hasTarget) {
        throw new Error("Interaction CSV must contain headers: 'compound_id' and 'protein_id' (or 'source'/'target').");
      }

      // Process
      const { graph, predictions } = processDatasets(interactionData, featureData);
      
      if (graph.nodes.length === 0) {
        throw new Error("No valid nodes found in the dataset.");
      }

      setSuccessInfo({ nodes: graph.nodes.length, edges: graph.links.length });
      
      // Delay slightly to show success state before switching context
      setTimeout(() => {
         onDataLoaded(graph, predictions);
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Failed to process files. Please check the format.");
      setIsProcessing(false);
    }
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center p-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-blue-900/20 rounded-full mb-4 ring-1 ring-blue-500/50">
           <Database size={32} className="text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Upload Research Data</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Import your custom Compound-Target interaction datasets. The system will parse the graph topology, convert it to HeteroData format, and run the link prediction model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Interaction File */}
        <div 
          className={`bg-slate-800/50 border-2 border-dashed rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all ${interactionFile ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800'}`}
          onClick={() => interactionInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={interactionInputRef} 
            className="hidden" 
            accept=".csv" 
            onChange={(e) => handleFileChange(e, 'interactions')} 
          />
          {interactionFile ? (
            <>
              <FileText size={40} className="text-emerald-400 mb-4" />
              <p className="font-semibold text-slate-200">{interactionFile.name}</p>
              <p className="text-xs text-slate-400 mt-1">{(interactionFile.size / 1024).toFixed(1)} KB</p>
              <div className="mt-4 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} /> Ready
              </div>
            </>
          ) : (
            <>
              <Upload size={40} className="text-slate-500 mb-4" />
              <p className="font-semibold text-slate-300">Interaction Data (Required)</p>
              <p className="text-xs text-slate-500 mt-2">Drag & drop or click to browse</p>
              <p className="text-xs font-mono text-slate-600 mt-4 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                headers: compound_id, protein_id
              </p>
            </>
          )}
        </div>

        {/* Feature File */}
        <div 
          className={`bg-slate-800/50 border-2 border-dashed rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all ${featureFile ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800'}`}
          onClick={() => featureInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={featureInputRef} 
            className="hidden" 
            accept=".csv" 
            onChange={(e) => handleFileChange(e, 'features')} 
          />
          {featureFile ? (
            <>
              <FileText size={40} className="text-emerald-400 mb-4" />
              <p className="font-semibold text-slate-200">{featureFile.name}</p>
              <p className="text-xs text-slate-400 mt-1">{(featureFile.size / 1024).toFixed(1)} KB</p>
              <div className="mt-4 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} /> Ready
              </div>
            </>
          ) : (
            <>
              <Upload size={40} className="text-slate-500 mb-4" />
              <p className="font-semibold text-slate-300">Compound Features (Optional)</p>
              <p className="text-xs text-slate-500 mt-2">Morgan fingerprints or properties</p>
              <p className="text-xs font-mono text-slate-600 mt-4 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                headers: compound_id, feature_vec
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {error && (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-900/20 px-4 py-3 rounded-lg border border-rose-800/50">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {successInfo && (
           <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/20 px-4 py-3 rounded-lg border border-emerald-800/50 animate-pulse">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">
              Successfully processed {successInfo.nodes} nodes and {successInfo.edges} interactions. Redirecting...
            </span>
          </div>
        )}

        <button 
          onClick={processFiles}
          disabled={isProcessing || !interactionFile || !!successInfo}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
            !interactionFile || successInfo
              ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
              : isProcessing 
                ? 'bg-blue-700 cursor-wait' 
                : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Parsing & Converting...
            </>
          ) : successInfo ? (
             <>Processing Complete</>
          ) : (
            <>
              Run Ingestion Pipeline <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DataUpload;
