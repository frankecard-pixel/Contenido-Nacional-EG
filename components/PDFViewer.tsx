
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, Maximize, X, ChevronLeft, ChevronRight, Loader2, Shield } from 'lucide-react';

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  onClose: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, onClose }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setScale(1.0);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-full flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <Maximize className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Visualizador de Documento</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vista protegida de contenido nacional</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <button 
              onClick={handleZoomOut}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-all"
              title="Alejar"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="px-3 text-[10px] font-black text-slate-900 dark:text-white w-16 text-center">
              {Math.round(scale * 100)}%
            </div>
            <button 
              onClick={handleZoomIn}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-all"
              title="Acercar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button 
              onClick={handleResetZoom}
              className="px-3 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-[9px] font-black uppercase text-slate-500 transition-all"
            >
              Reset
            </button>
          </div>

          <button 
            onClick={onClose}
            className="p-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-8 custom-scrollbar flex justify-center select-none" onContextMenu={(e) => e.preventDefault()}>
          <div className="shadow-2xl bg-white dark:bg-slate-900 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            )}
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<Loader2 className="w-10 h-10 text-blue-600 animate-spin" />}
              className="max-w-full"
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale} 
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(prev => prev - 1)}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
              Página {pageNumber} de {numPages || '...'}
            </div>
            <button 
              disabled={pageNumber >= (numPages || 1)}
              onClick={() => setPageNumber(prev => prev + 1)}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
            <Shield className="w-3 h-3" /> Documento protegido - Solo visualización interna
          </p>
        </div>
      </div>
    </div>
  );
};
