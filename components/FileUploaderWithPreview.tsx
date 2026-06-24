import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, FileText, Image as ImageIcon, Eye, Check, X, AlertCircle } from 'lucide-react';

interface FileUploaderWithPreviewProps {
  title: string;
  allowedTypes: 'image/*' | '.pdf' | 'all';
  onConfirm: (data: { base64?: string; url?: string; fileName?: string }) => void;
  onCancel: () => void;
  initialUrl?: string;
}

export const FileUploaderWithPreview: React.FC<FileUploaderWithPreviewProps> = ({
  title,
  allowedTypes,
  onConfirm,
  onCancel,
  initialUrl = ''
}) => {
  const [activeTab, setActiveTab] = useState<'local' | 'url'>('local');
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>(initialUrl);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file parsing
  const handleFile = (selectedFile: File) => {
    // Basic validation
    if (allowedTypes === 'image/*' && !selectedFile.type.startsWith('image/')) {
      setPreviewError('Por favor, selecciona un archivo de imagen válido.');
      return;
    }
    if (allowedTypes === '.pdf' && selectedFile.type !== 'application/pdf') {
      setPreviewError('Por favor, selecciona un archivo PDF válido.');
      return;
    }

    setPreviewError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result as string);
    };
    reader.onerror = () => {
      setPreviewError('Error al leer el archivo.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleConfirm = () => {
    if (activeTab === 'local') {
      if (!base64) {
        setPreviewError('Por favor, selecciona un archivo primero.');
        return;
      }
      onConfirm({ base64, fileName: file?.name || 'archivo' });
    } else {
      if (!inputUrl.trim()) {
        setPreviewError('Por favor, introduce una dirección URL válida.');
        return;
      }
      // Simple validation for URL format
      try {
        new URL(inputUrl);
        onConfirm({ url: inputUrl, fileName: inputUrl.split('/').pop() || 'archivo_url' });
      } catch (e) {
        setPreviewError('La URL proporcionada no es válida.');
      }
    }
  };

  const clearSelection = () => {
    setFile(null);
    setBase64('');
    setPreviewError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImageFile = (name: string, type?: string) => {
    if (type?.startsWith('image/')) return true;
    const ext = name.toLowerCase().split('.').pop();
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '');
  };

  const isPdfFile = (name: string, type?: string) => {
    if (type === 'application/pdf') return true;
    const ext = name.toLowerCase().split('.').pop();
    return ext === 'pdf';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {allowedTypes === 'image/*' ? 'Admite archivos PNG, JPG, JPEG o WEBP' : 'Admite archivos en formato PDF'}
            </p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => { setActiveTab('local'); setPreviewError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'local'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload size={14} />
            Archivo Local
          </button>
          <button
            onClick={() => { setActiveTab('url'); setPreviewError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <LinkIcon size={14} />
            Dirección URL
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {activeTab === 'local' ? (
            <div>
              {!base64 ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={allowedTypes}
                    className="hidden"
                  />
                  <div className="size-12 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                    <Upload size={22} />
                  </div>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                    Arrastra el archivo o haz clic para subir
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                    Tamaño máximo recomendado: 10MB
                  </p>
                </div>
              ) : (
                <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-4 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {isImageFile(file?.name || '', file?.type) ? <ImageIcon size={18} /> : <FileText size={18} />}
                      </div>
                      <div className="max-w-[250px]">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{file?.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">
                          {( (file?.size || 0) / (1024 * 1024) ).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={clearSelection}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* PREVIEW CONTAINER */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center p-2 min-h-[160px] max-h-[220px]">
                    {isImageFile(file?.name || '', file?.type) ? (
                      <img src={base64} alt="Preview" className="max-h-[200px] max-w-full object-contain rounded-lg shadow-sm" />
                    ) : isPdfFile(file?.name || '', file?.type) ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <FileText size={48} className="text-red-500" />
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Documento PDF cargado</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <FileText size={48} className="text-blue-500" />
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Archivo Listo para Confirmar</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dirección URL del Recurso</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://ejemplo.com/mi-archivo.png"
                    value={inputUrl}
                    onChange={(e) => { setInputUrl(e.target.value); setPreviewError(null); }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <LinkIcon size={16} />
                  </div>
                </div>
              </div>

              {/* URL PREVIEW CONTAINER */}
              {inputUrl.trim() && !previewError && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-2 min-h-[160px] max-h-[220px]">
                  {isImageFile(inputUrl) ? (
                    <img 
                      src={inputUrl} 
                      alt="URL Preview" 
                      className="max-h-[200px] max-w-full object-contain rounded-lg shadow-sm"
                      onError={() => setPreviewError('No se pudo cargar la imagen desde esta URL. Verifique que la dirección sea correcta e incluya protocolo HTTPS.')}
                    />
                  ) : isPdfFile(inputUrl) ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <FileText size={48} className="text-red-500" />
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Enlace de Documento PDF</span>
                      <span className="text-[10px] text-slate-500 font-mono text-center max-w-[250px] truncate">{inputUrl}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <FileText size={48} className="text-blue-500" />
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Enlace Externo Listo</span>
                      <span className="text-[10px] text-slate-500 font-mono text-center max-w-[250px] truncate">{inputUrl}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Errors */}
          {previewError && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl text-xs font-bold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{previewError}</span>
            </div>
          )}
        </div>

        {/* Footer/Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Check size={14} />
            Confirmar Selección
          </button>
        </div>

      </div>
    </div>
  );
};
