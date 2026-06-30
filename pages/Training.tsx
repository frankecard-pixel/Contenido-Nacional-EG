
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_TRAINING_CENTERS, MOCK_COURSES } from '../services/mockService';
import TrainingCenters from '../components/public/training/TrainingCenters';
import TrainingMap from '../components/public/training/TrainingMap';
import TrainingPrograms from '../components/public/training/TrainingPrograms';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Training: React.FC = () => {
  const { t } = useTranslation();
  const [mapFilter, setMapFilter] = useState<'all' | 'centers' | 'courses'>('all');

  const centerPoints = MOCK_TRAINING_CENTERS.map(tc => ({
    id: tc.id,
    lat: tc.lat || 0,
    lng: tc.lng || 0,
    title: tc.name,
    type: 'training' as const
  }));

  const coursePoints = MOCK_COURSES.map(course => ({
    id: course.id,
    lat: course.lat || 0,
    lng: course.lng || 0,
    title: `${course.title} (${course.centerName})`,
    type: 'hub' as const
  }));

  const mapPoints = [
    ...(mapFilter === 'all' || mapFilter === 'centers' ? centerPoints : []),
    ...(mapFilter === 'all' || mapFilter === 'courses' ? coursePoints : [])
  ];

  return (
    <div className="pb-24 bg-white dark:bg-slate-950">
      <PublicBanner 
        title="Capacitación y Formación" 
        subtitle="Programas de desarrollo de competencias para el talento nacional en la industria extractiva."
        category="Oportunidades"
        image="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="mx-auto px-6 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-6 mt-20" style={{ maxWidth: 'var(--layout-max-width)' }}>
        
        {/* Centers Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Centros de Formación Homologados</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">Instituciones certificadas por el Ministerio para impartir formación técnica avanzada con estándares internacionales de contenido nacional.</p>
        </div>
        <TrainingCenters centers={MOCK_TRAINING_CENTERS} />

        {/* Courses Section */}
        <div className="mb-16">
          <div className="border-t border-slate-100 dark:border-slate-800 pt-16 mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Cursos Especializados Disponibles</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">Adquiera capacidades críticas demandadas por los operadores internacionales para impulsar su incorporación laboral.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_COURSES.map(course => (
              <div key={course.id} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 rounded-lg text-[9px] font-black uppercase tracking-wider">{course.level}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.duration}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{course.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Impartido en: <span className="font-bold text-slate-700 dark:text-slate-300">{course.centerName}</span></p>
                
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {course.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">group</span>
                    {course.vacancies} plazas libres
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Map Filter & Map */}
        <div className="mb-24 border-t border-slate-100 dark:border-slate-800 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Geolocalización de Nodos de Aprendizaje</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Explore los centros físicos y la cobertura de cursos en todo el ámbito nacional.</p>
            </div>
            
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700">
              <button 
                type="button" 
                onClick={() => setMapFilter('all')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  mapFilter === 'all' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                Todos
              </button>
              <button 
                type="button" 
                onClick={() => setMapFilter('centers')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  mapFilter === 'centers' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                Centros
              </button>
              <button 
                type="button" 
                onClick={() => setMapFilter('courses')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  mapFilter === 'courses' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                Cursos
              </button>
            </div>
          </div>
          
          <TrainingMap mapPoints={mapPoints} />
        </div>

        <TrainingPrograms />
      </div>
    </div>
  );
};

export default Training;
