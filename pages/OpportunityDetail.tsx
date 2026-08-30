
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOpportunityById } from '../services/supabaseApi';
import { OpportunityExt } from '../types';
import { useAuth } from '../contexts/AuthContext';
import OpportunityDetailContent from '../components/public/opportunity-detail/OpportunityDetailContent';
import OpportunityDetailRestricted from '../components/public/opportunity-detail/OpportunityDetailRestricted';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowLeft,
  Briefcase,
  FileText,
  Lock,
  LayoutDashboard,
  ArrowLeftCircle
} from 'lucide-react';

const OpportunityDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user, session } = useAuth();
  const [opp, setOpp] = useState<OpportunityExt | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Verificación estricta de sesión activa: Supabase o sesión explícita en localStorage
  const isLoggedIn = Boolean(user) || (localStorage.getItem('user_session') === 'active');

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      try {
        const data = await getOpportunityById(id);
        setOpp(data as any);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary border-t-transparent"></div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando Ficha...</span>
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <FileText className="size-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Licitación no encontrada</h2>
        <p className="text-xs text-slate-500 mb-6">El expediente de licitación solicitado no existe o ha sido retirado.</p>
        <Link 
          to="/opportunities" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md"
        >
          <ArrowLeft className="size-4" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>
    );
  }

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || '';
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        
        {/* Banner Informativo de Sesión Activa */}
        {isLoggedIn && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-blue-950 dark:text-blue-200">
                Acceso Homologado Activo &bull; Modo Proveedor / Gestor RUGE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
              >
                <ArrowLeft className="size-3" />
                <span>Volver Atrás</span>
              </button>
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-xs"
              >
                <LayoutDashboard className="size-3" />
                <span>Mi Panel RUGE</span>
              </Link>
            </div>
          </div>
        )}

        {/* Barra Superior de Retorno y Referencia */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-primary dark:text-blue-400 font-black text-xs uppercase tracking-wider hover:opacity-80 transition-opacity bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-xs"
            >
              <ArrowLeft className="size-4" />
              <span>Volver</span>
            </button>

            <Link 
              to="/opportunities" 
              className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:text-primary transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-xs"
            >
              <span>Explorador</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs">
              REF: {opp.ref || opp.id.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-primary border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="size-3.5" />
              RUGE MMIE
            </span>
          </div>
        </div>
        
        {/* Contenedor Principal Adaptable */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 p-4 sm:p-8 md:p-10 shadow-sm overflow-hidden">
          {isLoggedIn ? (
            /* Vista 1: FICHA TÉCNICA COMPLETA PARA USUARIOS AUTENTICADOS */
            <OpportunityDetailContent opp={opp} getTranslatedText={getTranslatedText} />
          ) : (
            /* Vista 2: FICHA PÚBLICA CON RESTRICCIÓN INSTITUCIONAL PARA NO CONECTADOS */
            <div className="space-y-8">
              {/* Encabezado Informativo Público */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-6 sm:pb-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-primary text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {opp.category.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    <MapPin className="size-3 text-primary" />
                    {opp.location}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-900/60">
                    <Clock className="size-3" />
                    Cierre: {opp.deadline}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-snug mb-3">
                  {getTranslatedText(opp.title)}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {getTranslatedText(opp.description)}
                </p>

                {/* Resumen Matriz Pública */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Ubicación</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{opp.location}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Cuota Empleo Local</span>
                    <span className="text-xs sm:text-sm font-black text-primary">Min. 80% Nacional</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Régimen Jurídico</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Ley 2014 / MMIE</span>
                  </div>
                </div>
              </div>

              {/* Bloque de Acceso Restringido */}
              <OpportunityDetailRestricted />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;

